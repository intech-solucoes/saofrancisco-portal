import React from "react";
import { Report, ReportHeader, Page, ReportOrientation } from "@ronymmoura/react-reports";
import { PlanoService } from "@intechprev/prevsystem-service";
import { CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";

const config = require("../../config.json");

interface Props {
    preview: boolean;
    cdPlano: string;
    dtInicio: string;
    dtFim: string;
}

interface State {
    relatorio: any;
}

export class RelatorioExtrato extends React.Component<Props, State> {

    report = React.createRef<Report>();

    constructor(props: Props) {
        super(props);

        this.state = {
            relatorio: {
                Funcionario: {},
                Fundacao: {},
                Empresa: {},
                Plano: {},
                Ficha: []
            }
        }
    }

    componentDidMount = async () => {
        if(this.props.preview) 
            await this.preencherRelatorio();
    }

    download = async () => {
        await this.preencherRelatorio();
        await this.report.current.downloadPDF();
    }

    preencherRelatorio = async () => {
        var relatorio = await PlanoService.RelatorioExtratoPorPlanoReferencia(this.props.cdPlano, this.props.dtInicio, this.props.dtFim);
        await this.setState({ relatorio });
    }

    render() {
        return (
            <Report ref={this.report} preview={this.props.preview} downloadURL={`${config.apiUrl}/relatorios`}>
                <ReportHeader height={350}>
                    <table className={"table table-borderless table-sm"}>
                        <tbody>
                            <tr>
                                <td>
                                    <h5 className={"font-weight-bold"}>{this.state.relatorio.Fundacao.NOME_ENTID}</h5>
                                </td>
                                <td>
                                    <h5 className={"font-weight-bold text-right"}>Extrato de Contribuições</h5>
                                </td>
                            </tr>
                            <tr>
                                <td>{this.state.relatorio.Fundacao.END_ENTID}</td>
                                <td className={"text-right"}>Informações ao Participante</td>
                            </tr>
                            <tr>
                                <td>{this.state.relatorio.Fundacao.BAIRRO_ENTID}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className={"table table-borderless table-sm mt-3"}>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: "bold", width: 60 }}>CEP:</td>
                                <td style={{ width: 100 }}>{this.state.relatorio.Fundacao.CEP_ENTID}</td>
                                <td style={{ fontWeight: "bold", width: 70 }}>ESTADO:</td>
                                <td style={{ width: "auto" }}>{this.state.relatorio.Fundacao.UF_ENTID}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>TEL:</td>
                                <td>{this.state.relatorio.Fundacao.FONE_ENTID}</td>
                                <td style={{ fontWeight: "bold" }}>FAX:</td>
                                <td>{this.state.relatorio.Fundacao.FAX_ENTID}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>CNPJ:</td>
                                <td colSpan={2}>{this.state.relatorio.Fundacao.CPF_CGC}</td>
                                <td className={"text-right"}>
                                    <b>Período:</b> {this.props.dtInicio} a {this.props.dtFim}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table className={"table table-bordered table-sm"}>
                        <tbody>
                            <tr>
                                <td colSpan={2} style={{ width: "50%" }}>
                                    <b>Empresa Patrocinadora</b><br/>
                                    {this.state.relatorio.Empresa.NOME_ENTID}
                                </td>
                                <td colSpan={2}>
                                    <b>CNPJ</b><br/>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Nome Participante</b><br/>
                                    {this.state.relatorio.Funcionario.NOME_ENTID}
                                </td>
                                <td>
                                    <b>Matrícula</b><br/>
                                    {this.state.relatorio.Funcionario.NUM_MATRICULA}
                                </td>
                                <td>
                                    <b>Inscrição</b><br/>
                                    {this.state.relatorio.Funcionario.NUM_INSCRICAO}
                                </td>
                                <td>
                                    <b>Plano</b><br/>
                                    {this.state.relatorio.Plano.DS_PLANO}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ReportHeader>
                
                <Page>
                    <table className={"table table-sm table-bordered"}>
                        <thead>
                            <tr>
                                <th className={"text-center align-top"}>Mês / Ano Contrib</th>
                                <th className={"text-center align-top"} style={{ width: "70px" }}>Contribuição Participante</th>
                                <th className={"text-center align-top"} style={{ width: "70px" }}>Contribuição Patrocinadora</th>
                                <th className={"text-center align-top"} style={{ width: "90px" }}>Custeios Adm + Risco</th>
                                <th className={"text-center align-top"} style={{ width: "100px" }}>Valor Líquido</th>
                                <th className={"text-center align-top"} style={{ width: "70px" }}>Cota Conversão</th>
                                <th className={"text-center align-top"}>Qtde. Cotas Adquiridas</th>
                                <th className={"text-center align-top"}>Qtde. acumulada de Cotas detidas</th>
                                <th className={"text-center align-top"} style={{ width: "110px" }}>Valor Acumulado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.relatorio.Ficha.map((ficha: any, index: any) => {
                                return (
                                    <tr key={index}>
                                        <td>{ficha.MES_REF}/{ficha.ANO_REF}</td>
                                        <td><CampoEstatico valor={ficha.VL_GRUPO1} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td><CampoEstatico valor={ficha.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td><CampoEstatico valor={ficha.VL_GRUPO3} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td><CampoEstatico valor={ficha.VL_LIQUIDO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td><CampoEstatico valor={ficha.VL_COTA} tipo={TipoCampoEstatico.dinheiro} /></td>
                                        <td><CampoEstatico valor={ficha.QTE_COTA} tipo={TipoCampoEstatico.texto} /></td>
                                        <td><CampoEstatico valor={ficha.QTE_COTA_ACUM} tipo={TipoCampoEstatico.texto} /></td>
                                        <td><CampoEstatico valor={ficha.VL_ACUMULADO} tipo={TipoCampoEstatico.dinheiro} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <table className={"table table-sm table-bordered"}>
                        <tbody>
                            <tr>
                                <td className={"text-center align-top"}><b>Observação</b></td>
                                <td>
                                    Extrato para simples conferência. O saldo, em caso de resgate, será calculado nos termos do regulamento e poderá ser diferente do valor acumulado.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Page>
            </Report>
        );
    }
}