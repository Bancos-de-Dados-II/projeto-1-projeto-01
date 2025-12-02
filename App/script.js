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
            alert('Instituição deletada com sucesso (marcada como inativa)!');
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

        // Note: modal removed — confirmation happens via fixed button only

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

  // --- Visualizar instituições registradas (FUNÇÃO ATUALIZADA) ---
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
                    Excluir
                </button>

                <button class="btn-outline" onclick="window.open('http://google.com/maps/search/?api=1&query=${i.latitude},${i.longitude}','_blank')">Ver mapa</button>
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
       