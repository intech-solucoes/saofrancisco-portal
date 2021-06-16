﻿import { ProcessoBeneficioEntidade } from "./ProcessoBeneficioEntidade";
import { ModalidadeEntidade } from "./ModalidadeEntidade";
export class PlanoVinculadoEntidade {
  public CD_FUNDACAO: string;
  public NUM_INSCRICAO: string;
  public CD_PLANO: string;
  public DT_INSC_PLANO: Date;
  public CD_SIT_PLANO: string;
  public DT_SITUACAO_ATUAL: Date;
  public CD_MOTIVO_DESLIG: string;
  public DT_DESLIG_PLANO?: Date;
  public FUNDADOR: string;
  public PERC_TAXA_MAXIMA?: number;
  public GRUPO: string;
  public DT_PRIMEIRA_CONTRIB?: Date;
  public DT_VENC_CARENCIA?: Date;
  public CD_SIT_INSCRICAO: string;
  public TIPO_IRRF: string;
  public IDADE_RECEB_BENEF?: number;
  public cd_tipo_cobranca: string;
  public NUM_BANCO: string;
  public NUM_AGENCIA: string;
  public NUM_CONTA: string;
  public DIA_VENC?: number;
  public CD_GRUPO: string;
  public cd_perfil_invest?: number;
  public NUM_PROTOCOLO: string;
  public VITALICIO: string;
  public VL_PERC_VITALICIO?: number;
  public LEI_108: string;
  public SALDO_PROJ?: number;
  public PECULIO_INV?: number;
  public PECULIO_MORTE?: number;
  public INTEGRALIZA_SALDO: string;
  public CK_EXTRATO_CST: string;
  public DT_EMISSAO_CERTIFICADO?: Date;
  public TIPO_IRRF_CANC: string;
  public IND_OPTANTE_MAXIMA_BASICA: string;
  public IND_AFA_JUDICIAL: string;
  public DS_PERFIL_INVEST: string;
  public CD_CATEGORIA: string;
  public DS_CATEGORIA: string;
  public DS_PLANO: string;
  public DS_SIT_PLANO: string;
  public COD_CNPB: string;
  public SalarioContribuicao: number;
  public PercentualContribuicao: number;
  public ProcessoBeneficio: ProcessoBeneficioEntidade;
  public Modalidades: Array<ModalidadeEntidade>;
  public UltimoSalario: number;
  public CD_EMPRESA: string;
  public DT_INIC_VALIDADE?: Date;
  public VL_BENEF_SALDADO_ATUAL: number;
  public VL_BENEF_SALDADO_INICIAL: number;
}