import React, { Component } from 'react';

import { Report, ReportHeader, Page, ReportFooter } from "@ronymmoura/react-reports";
import { CampoEstatico, TipoCampoEstatico } from '@intechprev/componentes-web';

import { FichaFinanceiraAssistidoService, ContrachequeService } from "@intechprev/prevsystem-service";

const config = require("../../config.json");

const styles = {
    logo: {
        height: 100
    }
}

const Celula = (props: any) => {
    var width = props.width ? props.width : "auto";
    var colSpan = props.colSpan ? props.colSpan : null;

    return (
        <td style={{ width: width }} colSpan={colSpan}>
            <div className={"font-weight-bold"}>{props.titulo}</div>
            <div>{props.valor}</div>
        </td>
    );
}

interface Props {
    preview: boolean;
    cdPlano: any;
    dtReferencia: any;
}

interface State {
    relatorio: any;
}

export class RelatorioContracheque extends Component<Props, State> {

    report = React.createRef<Report>();

    constructor(props: Props) {
        super(props);

        this.state = {
            relatorio: {
                Funcionario: {},
                Entidade: {},
                Fundacao: {},
                Empresa: {},
                Plano: {},
                Ficha: {
                    Resumo: {
                        Referencia: "",
                        Bruto: "",
                        Descontos: "",
                        Liquido: ""
                    },
                    Proventos: [],
                    Descontos: []
                }
            }
        }
    }

    componentDidMount = async () => {
        var relatorio = await ContrachequeService.Relatorio(this.props.cdPlano, this.props.dtReferencia);
        await this.setState({ relatorio });
    }

    download = async () => {
        await this.report.current.downloadPDF();
    }

	render() {
		return (
			<Report ref={this.report} preview={this.props.preview} downloadURL={`${config.apiUrl}/relatorios`}>
                <ReportHeader height={100}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={"text-center"} style={{ width: 170 }}>
                                    <img src={`${config.apiUrl.replace('/api', '')}/imagens/logo.png`} alt="Logo São Francisco" style={styles.logo} />
                                </td>
                                <td style={{ verticalAlign: "top" }}>
                                    <div className={"font-weight-bold"}>{this.state.relatorio.Fundacao.NOME_ENTID}</div>
                                    <div className={"font-weight-bold"}>{this.state.relatorio.Fundacao.CPF_CGC}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ReportHeader>
                
                <Page>
                    <h4 className={"mb-3 text-center"}>CONTRACHEQUE</h4>

                    <table className={"table table-bordered table-sm"}>
                        <tbody>
                            <tr>
                                <Celula titulo={"Nome"} valor={this.state.relatorio.Entidade.NOME_ENTID} colSpan={2} />
                                <Celula titulo={"Data de Início"} valor={this.state.relatorio.Funcionario.DT_ADMISSAO} width={120} />
                                <Celula titulo={"Mês/Ano"} valor={this.state.relatorio.Ficha.Resumo.Referencia.substring(3)} width={70} />
                            </tr>
                            <tr>
                                <Celula titulo={"Plano"} valor={this.state.relatorio.Plano.DS_PLANO} />
                                <Celula titulo={"CPF"} valor={this.state.relatorio.Entidade.CPF_CGC} />
                                <Celula titulo={"Matrícula"} valor={this.state.relatorio.Funcionario.NUM_MATRICULA} colSpan={2} />
                            </tr>
                            <tr>
                                <Celula titulo={"Data de Crédito"} valor={this.state.relatorio.Ficha.Resumo.Referencia} />
                                <Celula titulo={"Banco"} valor={this.state.relatorio.Entidade.NUM_BANCO} />
                                <Celula titulo={"Agência"} valor={this.state.relatorio.Entidade.NUM_AGENCIA} />
                                <Celula titulo={"Conta"} valor={`${this.state.relatorio.Entidade.NUM_CONTA}`} colSpan={2} />
                            </tr>
                        </tbody>
                    </table>

                    <table className={"table table-bordered table-striped table-sm"}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th className={"text-center"}>Data</th>
                                <th className={"text-center"}>Qtd</th>
                                <th className={"text-right"}>Proventos</th>
                                <th className={"text-right"}>Descontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.relatorio.Ficha.Proventos.map((rubrica: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{rubrica.CD_RUBRICA}</td>
                                            <td>{rubrica.DS_RUBRICA}</td>
                                            <td className={"text-center"}>{rubrica.DT_REFERENCIA.substring(3)}</td>
                                            <td className={"text-center"}>{rubrica.PRAZO}</td>
                                            <td className={"text-right"}>
                                                {rubrica.VALOR_MC.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={"text-right text-danger"}></td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                this.state.relatorio.Ficha.Descontos.map((rubrica: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{rubrica.CD_RUBRICA}</td>
                                            <td>{rubrica.DS_RUBRICA}</td>
                                            <td className={"text-center"}>{rubrica.DT_REFERENCIA.substring(3)}</td>
                                            <td className={"text-center"}>{rubrica.PRAZO}</td>
                                            <td className={"text-right"}></td>
                                            <td className={"text-right text-danger"}>
                                                {rubrica.VALOR_MC.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>

                    <table className={"table table-bordered table-sm"}>
                        <tfoot>
                            <tr>
                                <th>
                                    <span className="float-left">Total de Proventos:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Ficha.Resumo.Bruto.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                                <th>
                                    <span className="float-left">Total de Descontos:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Ficha.Resumo.Descontos.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                                <th>
                                    <span className="float-left">Valor Líquido:</span>
                                    <span className="float-right">
                                        {this.state.relatorio.Ficha.Resumo.Liquido.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </Page>
			</Report>
		);
	}
}