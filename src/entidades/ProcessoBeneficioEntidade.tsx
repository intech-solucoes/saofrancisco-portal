﻿

export class ProcessoBeneficioEntidade {
  public CD_FUNDACAO: string;
  public CD_EMPRESA: string;
  public CD_PLANO: string;
  public CD_ESPECIE: string;
  public NUM_PROCESSO: number;
  public ANO_PROCESSO: string;
  public VERSAO: number;
  public NUM_INSCRICAO: string;
  public CD_PERFIL_INVESTIM: string;
  public DT_PROX_PAGTO?: Date;
  public DT_TERMINO?: Date;
  public DT_RETROATIVIDADE?: Date;
  public DT_CONCESSAO?: Date;
  public NUM_TOT_PARCELAS?: number;
  public NUM_PARCELAS_PAG?: number;
  public SALDO_INICIAL?: number;
  public SALDO_ATUAL?: number;
  public SALDO_ANTERIOR?: number;
  public TIPO_CALCULO: string;
  public CD_SITUACAO: string;
  public VL_PERC_RESGATE?: number;
  public VL_PARC_RESGATE?: number;
  public VL_FATOR_REDUTOR?: number;
  public VL_REDUTOR_ATUARIAL?: number;
  public DT_REINICIO_PAGTO?: Date;
  public NUM_PROCESSO_PREV: string;
  public DT_INI_REVISAO?: Date;
  public FATOR_VINCULACAO?: number;
  public FATOR_ALIQUOTA?: number;
  public CD_CARGO: string;
  public CD_NIVEL_SALARIAL: string;
  public PROC_REVISAO: string;
  public DT_ULTIMA_REVISAO?: Date;
  public SALDO_RISCO?: number;
  public DT_PREV_PAGTO_SAQUE?: Date;
  public DT_PAGTO_SAQUE?: Date;
  public CD_CALC_REGRESSIVO: string;
  public VL_PMP?: number;
  public CD_OPCAO_RECEB_RENDA: string;
  public CD_OPCAO_RECEB_BP: string;
  public CD_OPCAO_RECEB_BAV: string;
  public DT_INICIO_RENDA?: Date;
  public DT_INICIO_BP?: Date;
  public DT_INICIO_BAV?: Date;
  public DT_TERMINO_RENDA?: Date;
  public DT_TERMINO_BP?: Date;
  public DT_TERMINO_BAV?: Date;
  public PRAZO_RECEB?: number;
  public DT_ULTIMO_PROCESSAMENTO?: Date;
  public CD_TIPO_CALC_CD?: number;
  public CD_PLANO_SALARIAL: string;
  public TIPO_PAGTO_TAXA: string;
  public ID_COMP_LIQUID: string;
  public FATOR_REDUTOR?: number;
  public ANT_PECUL_BENEF: string;
  public PERC_REAJ_VR?: number;
  public SALDO_RVITALICIA?: number;
  public NUM_SEQ_DEP?: number;
  public SEXO_DEP: string;
  public DT_NASC_DEP?: Date;
  public DT_VALIDADE_DEP?: Date;
  public VL_ADICIONAL?: number;
  public VL_INDIVIDUAL?: number;
  public VL_GLOBAL?: number;
  public SALDO_PARTICIPANTE?: number;
  public SALDO_PATROCINADORA?: number;
  public DT_OPCAO_BPD?: Date;
  public PRAZO_DIFERIMENTO?: number;
  public SALDO_CUSTEIO_PLANO?: number;
  public VAL_CUST_ADM?: number;
  public VAL_CUST_FUNDO?: number;
  public SALDO_ANT_RISCO?: number;
  public SALDO_ATUAL_RISCO?: number;
  public PERC_SALDO_RISCO?: number;
  public SALDO_INIC_RISCO?: number;
  public DS_ESPECIE: string;
  public DS_SITUACAO: string;
  public DT_REQUERIMENTO?: Date;
  public DT_AFASTAMENTO?: Date;
  public DT_INICIO_PREV?: Date;
  public DT_INICIO_FUND?: Date;
  public VL_PARCELA_MENSAL?: number;
  public DS_OPCAO_RECEB: string;
  public DT_APOSENTADORIA?: Date;
  public DS_PROCESSO: string;
  public ESPECIE_ANO_NUM_PROCESSO: string;
  public OPCAO_RECB_13: string;
}