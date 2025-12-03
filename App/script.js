 let center = [-6.8886, -38.5566];
        let map = L.map('map').setView(center, 15);

        var icon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/4874/4874738.png',
            iconSize: [30,30]
        });

        let marker = L.marker(center,{
            draggable: true,
            icon: icon
        }).addTo(map);

        // Deletar
        async function deleteInstitution(id, name) {
    if (!confirm(`Tem certeza que deseja deletar a instituição "${name}"? Esta ação é irreversível.`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/institutions/${id}`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            alert('Instituição deletada com sucesso!');
            location.reload(); 
        } else if (response.status === 404) {
            alert('Erro: Instituição não encontrada.');
        } else {
            const errorBody = await response.json();
            alert(`Erro ao deletar: ${errorBody.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro de rede ao deletar instituição:', error);
        alert('Erro de conexão com o servidor ao deletar.');
    }
}

// Botão editar 
async function editInstitution(id) {

    try {
        const response = await fetch(`http://localhost:3000/institutions/${id}`);

        if (!response.ok) {
            alert("Instituição não encontrada.");
            return;
        }

        const inst = await response.json();

        formCard.classList.remove('hidden');
        enableFormInputs();

        document.getElementById('titulo-form').innerText = "Editar Instituição";
        document.getElementById('inputNome').value = inst.name;
        document.getElementById('inputCnpj').value = inst.cnpj;
        document.getElementById('inputEmail').value = inst.email;
        document.getElementById('inputPhone').value = inst.phone;
        document.getElementById('inputAddress').value = inst.address;

        // Mover marker
        marker.setLatLng([inst.latitude, inst.longitude]);
        map.setView([inst.latitude, inst.longitude], 15);

        botaoAdicionar.innerText = "Salvar Alterações";

        botaoAdicionar.onclick = null;

        botaoAdicionar.onclick = async () => {
            const updatedInst = {
                name: document.getElementById('inputNome').value,
                cnpj: document.getElementById('inputCnpj').value,
                email: document.getElementById('inputEmail').value,
                phone: document.getElementById('inputPhone').value,
                address: document.getElementById('inputAddress').value,
                latitude: marker.getLatLng().lat,
                longitude: marker.getLatLng().lng
            };

            const updateResponse = await fetch(`http://localhost:3000/institutions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedInst)
            });

            if (updateResponse.ok) {
                alert("Instituição atualizada com sucesso!");
                location.reload();
            } else {
                const err = await updateResponse.json();
                alert("Erro ao salvar: " + (err.error || "Desconhecido"));
            }
        };

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados da instituição.");
    }
}

        map.locate();
        map.on('locationfound', location =>{
            map.setView(location.latlng);
            marker.setLatLng(location.latlng);
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const formCard = document.getElementById('form');
        const confirmLocationBtn = document.getElementById('btConfirmLocation');
        const botaoAdicionar = document.getElementById('btAdicionar');
        
        // Obter todos os inputs do formulário
        const formInputs = formCard.querySelectorAll('input, select');

        // Função para desabilitar/habilitar os inputs
        function disableFormInputs() {
            formInputs.forEach(input => {
                input.disabled = true;
            });
            botaoAdicionar.disabled = true;
        }

        function enableFormInputs() {
            formInputs.forEach(input => {
                input.disabled = false;
            });
            botaoAdicionar.disabled = false;
        }

        // Desabilitar inputs inicialmente
        disableFormInputs();

        // Buscar local
        let botaoBuscar = document.getElementById('btBuscar');
        botaoBuscar.onclick = () => {
            let texto = document.getElementById('inputLocal').value;
            if (!texto.trim()) {
                alert('Por favor, digite um local para buscar');
                return;
            }
            fetch(
                `https://nominatim.openstreetmap.org/search?q=${texto}&format=json`
            ).then(response => response.json()).
            then(data => {
                if (data.length === 0) {
                    alert('Instituição não encontrada');
                    return;
                }
                let resultado = data[0];
                let latlng = [
                    parseFloat(resultado.lat),
                    parseFloat(resultado.lon)
                ];
                map.setView(latlng, 15);
                marker.setLatLng(latlng);
                
                // Mostrar botão fixo de confirmação
                confirmLocationBtn.classList.add('visible');
            }).catch(error =>{
                alert('Erro ao buscar a instituição');
            });
        };

        // Confirmar localização pelo botão fixo - mostrar formulário e habilitar inputs
        confirmLocationBtn.onclick = () => {
            confirmLocationBtn.classList.remove('visible');
            formCard.classList.remove('hidden');
            enableFormInputs();
        };


        // Adicionar instituição
        botaoAdicionar.onclick = () =>{
            let institution = {
                name: document.getElementById('inputNome').value,
                cnpj: document.getElementById('inputCnpj').value,
                email: document.getElementById('inputEmail').value,
                phone: document.getElementById('inputPhone').value,
                address: document.getElementById('inputAddress').value,
                latitude: marker.getLatLng().lat,
                longitude: marker.getLatLng().lng   
            }
            fetch('http://localhost:3000/institutions',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(institution)
            }).then(response =>{
                if(response.status === 201){
                    alert('Instituição adicionada com sucesso');
                    location.reload()
                }
            });
        }

        map.on('load', () => {
            fetch('http://localhost:3000/institutions')
                .then(response => response.json())
                .then(data => {
                    for(let i of data){
                        L.marker([i.latitude, i.longitude], {icon: icon})
                            .addTo(map)
                            .bindPopup(
                                `<b>${i.name}</b><br/>
                                CNPJ: ${i.cnpj}<br/>
                                Email: ${i.email}<br/>
                                Telefone: ${i.phone}<br/>
                                Endereço: ${i.address}`
                            );
                    }
                })
        });

const btViewInstitutions = document.getElementById('btViewInstitutions');
const institutionsList = document.getElementById('institutionsList');

function renderInstitutions(items){
    if(!items || items.length === 0){
        institutionsList.innerHTML = '<div class="inst-item">Nenhuma instituição registrada.</div>';
        return;
    }

    const html = items.map(i => `
        <div class="inst-item">
            <div class="inst-meta">
                <b>${i.name}</b>
                <small>CNPJ: ${i.cnpj} — ${i.email} — ${i.phone}</small>
                <small>${i.address || ''}</small>
            </div>
            <div class="inst-actions">
                <button 
                    class="btn-danger" 
                    onclick="deleteInstitution('${i.id}', '${i.name}')"
                    aria-label="Deletar ${i.name}"
                >
                    Deletar Cadastro
                </button>

                <button class="btn-outline" onclick="window.open('http://google.com/maps/search/?api=1&query=${i.latitude},${i.longitude}','_blank')">Ver mapa</button>
                <button class="btn-outline" onclick="editInstitution('${i.id}')">Editar</button>
            </div>
        </div>
    `).join('');

    institutionsList.innerHTML = html;
}

btViewInstitutions.onclick = () => {
    const isHidden = institutionsList.classList.contains('hidden');
    if(!isHidden){
        institutionsList.classList.add('hidden');
        return;
    }

    // buscar e mostrar
    fetch('http://localhost:3000/institutions')
        .then(r => r.json())
        .then(data => {
            renderInstitutions(data);
            institutionsList.classList.remove('hidden');
        }).catch(err => {
            console.error('Erro ao buscar instituições', err);
            alert('Erro ao buscar instituições no servidor');
        });
};     

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pegar os elementos
    const modal = document.getElementById('modalOverlay');
    const btnAbrir = document.getElementById('btViewInstitutions');
    const btnFechar = document.getElementById('btCloseModal');

    // 2. Função para Abrir
    btnAbrir.addEventListener('click', () => {
        // Se você tiver uma função que carrega a lista (ex: renderList()), chame ela aqui:
        // renderList(); 
        
        modal.classList.remove('hidden'); // Remove a classe que esconde
    });

    // 3. Função para Fechar (Clicando no X)
    btnFechar.addEventListener('click', () => {
        modal.classList.add('hidden'); // Adiciona a classe que esconde
    });

    // 4. Fechar ao clicar fora da caixa branca (UX melhor)
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) { // Se clicou no fundo escuro, e não na caixa
            modal.classList.add('hidden');
        }
    });
    

});
       