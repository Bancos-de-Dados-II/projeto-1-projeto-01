import mongoose, { Document, Schema } from "mongoose";
import type { Institution } from "../domain/entities/Institution.js"; 

export interface IInstitutionDocument extends Omit<Institution, 'id'>, Document {
    id: string; 
    
    location: {
      type: string;
      coordinates: [number, number]; 
    };
}

const InstitutionSchema = new Schema<IInstitutionDocument>(
  {
    name: { type: String, required: true },
    cnpj: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    active: { type: Boolean, required: false, default: true },

    location: {
      type: { 
        type: String, 
        enum: ['Point'], 
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], 
        required: true
      }
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); 
        delete (ret as { _id?: unknown })._id;
        delete (ret as { __v?: unknown }).__v; 
      },
    },
  }
);


InstitutionSchema.index({ location: "2dsphere" });

InstitutionSchema.virtual('id').get(function() {
  return this._id.toString();
});

export const InstitutionModel = mongoose.model<IInstitutionDocument>("Institution", InstitutionSchema);