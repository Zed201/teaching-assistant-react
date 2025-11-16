import React, { useState } from 'react';

export type StatusColorType = 'Verde' | 'Laranja' | 'Vermelho';

export interface StatusDetail {
    cor: StatusColorType;
    status: string; 
    motivos: { descricao: string; detalhe: string }[];
    observacao?: string;
}

interface StatusActionBadgeProps {
  statusData: StatusDetail;
}

const colorMap = {
  Verde: 'bg-green-600 hover:bg-green-700 shadow-green-400/50',
  Laranja: 'bg-amber-500 hover:bg-amber-600 shadow-amber-400/50',
  Vermelho: 'bg-red-600 hover:bg-red-700 shadow-red-400/50',
};

const StatusActionBadge: React.FC<StatusActionBadgeProps> = ({ statusData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorClasses = colorMap[statusData.cor] || 'bg-gray-500 hover:bg-gray-600 shadow-gray-400/50';

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Botão Interativo com a Cor do Status */}
      <button
        type="button"
        onClick={handleOpenModal}
        className={`inline-flex items-center rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-200 transform hover:scale-[1.03] ${colorClasses}`}
        title={`Clique para ver detalhes: ${statusData.status}`}
      >
        {statusData.status}
      </button>

      {/* Modal de Detalhamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            
            {/* Header do Modal com cor de fundo */}
            <div className={`p-4 rounded-t-xl text-white ${colorClasses.split(' ')[0]}`}>
                <h3 className="text-xl font-bold flex justify-between items-center">
                    Detalhes da Situação Acadêmica
                    <button onClick={handleCloseModal} className="text-white hover:text-gray-200 text-2xl leading-none">
                        &times;
                    </button>
                </h3>
                <p className="text-sm mt-1 font-semibold">{statusData.status}</p>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4">
                
                {/* Métricas e Observações */}
                {statusData.observacao && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
                        <p className="font-semibold">Observação:</p>
                        <p className="text-sm">{statusData.observacao}</p>
                    </div>
                )}

                {/* Lista de Motivos */}
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">Motivos da Classificação ({statusData.cor})</h4>
                <ul className="space-y-3">
                    {statusData.motivos.map((motivo, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <span className="text-lg mr-2 text-gray-400">•</span>
                            <div>
                                <strong className="text-gray-900">{motivo.descricao}:</strong>{' '}
                                <span className="text-gray-600">{motivo.detalhe}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <button 
                        onClick={handleCloseModal} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                    >
                        Fechar
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusActionBadge;