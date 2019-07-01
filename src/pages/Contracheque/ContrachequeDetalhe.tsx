import React from 'react';
import { ContrachequeService, PlanoService } from "@intechprev/prevsystem-service";
import { Row, Col, Box, Botao, CampoEstatico } from "@intechprev/componentes-web";
import { Page } from '..';
import { HomeCard } from '../Home/HomeCard';

interface Props {
    match?: any;
}

interface State {
    plano: any,
    contracheque: {
        Proventos: any,
        Descontos: any,
        Resumo: { 
            Bruto: any,
            Descontos: any,
            Liquido: any,
            DesTipoFolha: string
        }
    },
    cdPlano: string,
    dataReferencia: string,
    cdTipoFolha: string
}

var erro = false;
export default class ContrachequeDetalhe extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: {},
            contracheque: {
                Proventos: [],
                Descontos: [],
                Resumo: { 
                    Bruto: "",
                    Descontos: "",
                    Liquido: "",
                    DesTipoFolha: ""
                }
            },
            cdPlano: props.match.params.plano,
            dataReferencia: props.match.params.data,
            cdTipoFolha: props.match.params.cdTipoFolha
        };

        this.page = React.createRef();
    }

    async componentDidMount() {
        var plano = await PlanoService.BuscarPorCodigo(this.state.cdPlano);
        await this.setState({ plano });

        var contracheque = await ContrachequeService.BuscarPorPlanoReferenciaTipoFolha(this.state.cdPlano, this.state.dataReferencia, this.state.cdTipoFolha);
        await this.setState({ contracheque });

        await this.page.current.loading(false);
    }

    gerarRelatorio = async () => {
        // this.relatorio.current.download();

        var relatorio = await ContrachequeService.Relatorio(this.state.cdPlano, this.state.dataReferencia, this.state.cdTipoFolha);

        const url = window.URL.createObjectURL(new Blob([relatorio]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contracheque.pdf');
        document.body.appendChild(link);
        link.click();
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
                <Page {...this.props} ref={this.page} titulo={"Contracheque " + this.state.dataReferencia.replace(".", "/").replace(".", "/").substring(3)}>
                    <Row>
                        <Col tamanho={"3"}>
                            <HomeCard titulo={this.state.plano.DS_PLANO}>
                                {this.state.plano.DS_CATEGORIA}
                            </HomeCard>
                        </Col>
                        <Col tamanho={"3"}>
                            <HomeCard titulo={"Tipo"}>
                                {this.state.contracheque.Resumo.DesTipoFolha}
                            </HomeCard>
                        </Col>
                        {this.state.contracheque.Proventos.length > 0 &&
                            <Col tamanho={"6"}>
                                <HomeCard titulo={"ESPÉCIE"}>
                                    {this.state.contracheque.Proventos[0].DS_ESPECIE}
                                </HomeCard>
                            </Col>
                        }
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
                        </Col>
                    </Row>
                </Page>
            );
        }
    }
}