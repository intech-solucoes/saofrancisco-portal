import React from 'react';
import { ContrachequeService, PlanoService } from "@intechprev/prevsystem-service";
import { Row, Col, Box, Botao } from "@intechprev/componentes-web";
import { Page } from '..';
import { RelatorioContracheque } from './RelatorioContracheque';

interface Props {
    match?: any;
}

interface State {
    plano: any,
    resumo: any,
    contracheque: {
        Proventos: any,
        Descontos: any,
        Resumo: { 
            Bruto: any,
            Descontos: any,
            Liquido: any
        }
    },
    cdPlano: string,
    dataReferencia: string
}

var erro = false;
export default class ContrachequeDetalhe extends React.Component<Props, State> {

    private page = React.createRef<Page>();
    private relatorio = React.createRef<RelatorioContracheque>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            resumo: {},
            contracheque: {
                Proventos: [],
                Descontos: [],
                Resumo: { 
                    Bruto: "",
                    Descontos: "",
                    Liquido: ""
                }
            },
            cdPlano: props.match.params.plano,
            dataReferencia: props.match.params.data
        };

        this.page = React.createRef();
    }

    async componentDidMount() {
        var plano = await PlanoService.BuscarPorCodigo(this.state.cdPlano);
        await this.setState({ plano });

        var contracheque = await ContrachequeService.BuscarPorPlanoReferenciaTipoFolha(this.state.cdPlano, this.state.dataReferencia);
        await this.setState({ contracheque });

        await this.page.current.loading(false);
    }

    gerarRelatorio = async () => {
        this.relatorio.current.download();
    }

    render() {
        if(erro) {
            return (
                <Page {...this.props} ref={this.page}>
                    <div className="alert alert-danger">Não há detalhes para o mês escolhido!</div>
                </Page>
            );
        } else {
            return (
                <Page {...this.props} ref={this.page}>
                    <Row>
                        <Col className={"col-lg-4"}>
                            <Box>
                                <Row className={"text-center"}>

                                    <Col className={"col-lg-4"}>
                                        <h5>BRUTO</h5>
                                        <span className="text text-info">R$ {this.state.contracheque.Resumo.Bruto.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </Col>

                                    <Col className={"col-lg-4"}>
                                        <h5>DESCONTOS</h5>
                                        <span className="text text-danger">R$ {this.state.contracheque.Resumo.Descontos.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </Col>

                                    <Col className={"col-lg-4"}>
                                        <h5>LÍQUIDO</h5>
                                        <span className="text text-warning">R$ {this.state.contracheque.Resumo.Liquido.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </Col>

                                </Row>
                            </Box>
                        </Col>

                        <Col className={"col-lg-12"}>
                            <Box>
                                <Row>

                                    <Col className={"col-lg-6"}>
                                        <h2>
                                            <i className="fa fa-plus-circle text-success"></i>
                                            Rendimentos
                                        </h2>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Descrição</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.contracheque.Proventos.map((rendimento: any, index: number) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{rendimento.DS_RUBRICA}</td>
                                                                <td>R$ {rendimento.VALOR_MC.toLocaleString('pt-br', {minimumFractionDigits: 2})}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Col>

                                    <Col className={"col-lg-6"}>
                                        <h2>
                                            <i className="fa fa-minus-circle text-danger"></i>
                                            Descontos
                                        </h2>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Descrição</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.contracheque.Descontos.map((desconto: any, index: number) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{desconto.DS_RUBRICA}</td>
                                                                <td>R$ {desconto.VALOR_MC.toLocaleString('pt-br', {minimumFractionDigits: 2})}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Col>

                                </Row>

                                <Botao titulo={"Baixar"} className="btn btn-primary" onClick={this.gerarRelatorio} usaLoading />
                            </Box>

                            <RelatorioContracheque ref={this.relatorio} cdPlano={this.state.cdPlano} dtReferencia={this.state.dataReferencia} preview={false} />
                        </Col>
                    </Row>
                </Page>
            );
        }
    }
}
