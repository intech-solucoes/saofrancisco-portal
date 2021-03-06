﻿import { CarenciasDisponiveisEntidade } from "./CarenciasDisponiveisEntidade";

export class NaturezaEntidade {
  public CD_NATUR: number;
  public DS_NATUR: string;
  public CD_GRUPO: number;
  public CD_FUNDO: string;
  public MES_CALC_PREST: number;
  public DIA_VENC_PREST: number;
  public DT_VENC_FSF: string;
  public IDADE_MINIMA?: number;
  public TEMPO_MINIMO?: number;
  public CAR_QUIT_NORMAL?: number;
  public CAR_QUIT_ANTEC?: number;
  public CAR_RENOVACAO?: number;
  public CAR_SOLICITACAO?: number;
  public PRAZO_MIN?: number;
  public PRAZO_MAX?: number;
  public CREDITO_UNICO: string;
  public DIA_CREDITO?: number;
  public MES_CALC_CRED?: number;
  public DT_CRED_FSF: string;
  public LIMITE_DT_CREDITO?: number;
  public PREST_RESTANTES_RENOV?: number;
  public RENOVACAO_MIN_PERC?: number;
  public RENOVACAO_MAX_PERC?: number;
  public SITUACAO: string;
  public CD_CATEGORIA?: number;
  public ID_CONVENIO: string;
  public VL_FATOR_CALCULO?: number;
  public CONSIDERAR_LIMITE_EMPRESTIMO: string;
  public CATEGORIA_ATIVO: string;
  public CATEGORIA_ASSISTIDO: string;
  public CATEGORIA_AUTOPATROCINADO: string;
  public VL_INDICE_PROVISIONADO?: number;
  public LIMITAR_SALARIO_MINIMO: string;
  public MES_CRED_CIVIL: string;
  public MAX_CONTR_ATIVOS?: number;
  public TEMPO_TIPO_CONTRIBUICAO?: number;
  public LIMITE_TIPO_CONTRIBUICAO?: number;
  public MAX_CONTR_REFORMADOS?: number;
  public CATEGORIA_DIFERIDO: string;
  public CARENCIA_MIN?: number;
  public CARENCIA_MAX?: number;
  public CONSIDERAR_CARENCIA_CONCESSAO: string;
  public SOMENTE_REFINANCIAMENTO: string;
  public AUTORIZACAO_ESPECIAL: string;
  public PERMITE_REFORMA: string;
  public PERCENTUAL_DESCONTO?: number;
  public ID_TEMP_VINC: string;
  public PERMITE_CONCESSAO_WEB: string;
  public Carencias: Array<CarenciasDisponiveisEntidade>;
  public MargemConsignavel: number;
  public TaxaMargemConsignavel: number;
  public TaxaJuros: number;
  public DatasCredito: Array<Date>;
}