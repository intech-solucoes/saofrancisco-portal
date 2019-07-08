import React from 'react';
import { InfoRendService } from "@intechprev/prevsystem-service";
import { Row, Col, Box, Form, Botao } from '@intechprev/componentes-web';
import { Page } from "..";

interface Props {}

interface State {
    datas: any,
    dataSelecionada: any,
    informe: {
        Grupos: any,
        ANO_CALENDARIO: string,
        ANO_EXERCICIO: string
    }
}

export class InformeRendimentos extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private form = React.createRef<Form>();

    constructor(props: Props) {
        super(props);

        this.state = {
            datas: [],
            dataSelecionada: {},
            informe: {
                Grupos: [],
                ANO_CALENDARIO: "",
                ANO_EXERCICIO: ""
            }
        }

        this.page = React.createRef();
    }

    async componentDidMount() {
        try {
            var datas = await InfoRendService.BuscarReferencias();
            await this.setState({ datas });

            if(this.state.datas[0])
                this.selecionarAno(this.state.datas[0]);
            
            await this.page.current.loading(false);
        } catch(err) {
            console.error(err);
        }
    }

    selecionarAno = async (ano: string) => {
        try {
            await this.setState({ dataSelecionada: ano });
            var informe = await InfoRendService.BuscarPorReferencia(ano);
            this.setState({ informe });
        } catch(err) {
            console.error(err);
        }
    }

    gerarRelatorio = async () => {
        try { 
            await this.form.current.validar();
            var relatorio = await InfoRendService.Relatorio(this.state.dataSelecionada);
            const url = window.URL.createObjectURL(new Blob([relatorio]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'informe de rendimentos.pdf');
            document.body.appendChild(link);
            link.click();

        } catch(err) {
            console.error(err);
        }
    }

    render() {
        if (this.state.datas.length > 0) {
            return (
                <Page {...this.props} ref={this.page}>
                    <Row>
                        <Col className="col-lg-8">
                            <Box titulo={"Resumo"}>
                                <Form ref={this.form}>
                                    <Row className={"form-group"}>
                                        <label htmlFor="referencia" className="col-sm-2 col-form-label"><b>Calendário:</b></label>
                                        <Col className={"col-sm-6"}>
                                            <select id="referencia" className="form-control">
                                                {this.state.datas.map((data: string, index: number) => <option key={index}>{data}</option>)}
                                            </select>
                                        </Col>
                                    </Row>
                                    <div></div>
                                </Form>
                                <h4>Ano Exercício: <span className="text-primary">{this.state.informe.ANO_EXERCICIO}</span></h4>
                                <h4>Ano Calendário: <span className="text-primary">{this.state.informe.ANO_CALENDARIO}</span></h4>
                                <br/>

                                {
                                    this.state.informe.Grupos.map((informe: any, index: number) => {
                                        return (
                                            <div key={index}>
                                                <h5><b>{informe.DES_GRUPO}</b></h5>

                                                <table className="table table-striped">
                                                    <tbody>
                                                            {
                                                                informe.Itens.map((linha: any, index: number) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{linha.DES_INFO_REND}</td>
                                                                            <td className="text-right" style={{ width: 150 }}>
                                                                                <b>R$ {linha.VAL_LINHA.toLocaleString('pt-br', {minimumFractionDigits: 2})}</b>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            }
                                                    </tbody>
                                                </table>
                                                <br/>
                                            </div>
                                        );
                                    })
                                }

                                <Botao className="btn btn-primary" titulo={"Gerar Informe de Rendimentos"} 
                                       onClick={this.gerarRelatorio} />
                            </Box>
                        </Col>
                    </Row>
                </Page>
            );
        } else {
            return (
                <Page {...this.props} ref={this.page}>
                    <div id="sem-informe" className="alert alert-danger">Nenhum informe disponível.</div>
                </Page>
            );
        }
    }
}