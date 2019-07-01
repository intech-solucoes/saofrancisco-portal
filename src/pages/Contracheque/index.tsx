import React from 'react';
import { ContrachequeService, PlanoService } from "@intechprev/prevsystem-service";
import { Row, Col, Box } from "@intechprev/componentes-web";
import { Page } from "..";
import { Link } from "react-router-dom";
import ContrachequeDetalhe from './ContrachequeDetalhe';

export { ContrachequeDetalhe }

interface Props {}

interface State {
    planos: any
}

export default class Contracheque extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: []
        }
    }

    componentDidMount = async () => {
        var resultPlanos = await PlanoService.Buscar()
        await this.buscarDatas(resultPlanos);
        await this.page.current.loading(false);
    }

    buscarDatas = async (planos: any) => {
        for(var i = 0; i < planos.length; i++) {
            var datas = await ContrachequeService.BuscarDatas(planos[i].CD_PLANO);
            planos[i].contracheque = datas;

            await this.setState({ 
                planos: [...this.state.planos, planos[i]]
            });
        }
    }
    
    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {
                    this.state.planos.map((plano: any, index: number) => {
                        return (

                            <Row key={index}>
                                <Col className={"col-lg-8"}>
                                    <Box titulo={""}>
                                        <div className={"cc-title"}>
                                            PLANO {plano.DS_PLANO} 
                                            {plano.contracheque.length > 0 &&
                                                <small className={"ml-2 cc-small"}>ESPÉCIE:' {plano.contracheque[0].DS_ESPECIE}</small>
                                            }
                                        </div>
                                        <br />

                                        {plano.contracheque.length > 0 && 
                                            <table className="table">

                                                <thead>
                                                    <tr>
                                                        <th>Referência</th>
                                                        <th>Tipo</th>
                                                        <th>Bruto</th>
                                                        <th>Descontos</th>
                                                        <th>Líquido</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        plano.contracheque.map((valor: any, index: number) => {
                                                            return (
                                                                <tr key={index} >
                                                                    <td>
                                                                        {valor.DT_REFERENCIA.substring(3)}
                                                                    </td>
                                                                    <td>
                                                                        {valor.DS_TIPO_FOLHA}
                                                                    </td>
                                                                    <td className="text-info">
                                                                        {valor.VAL_BRUTO.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                                                                    </td>
                                                                    <td className="text-danger">
                                                                        {valor.VAL_DESCONTOS.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                                                                    </td>
                                                                    <td className="text-success">
                                                                        {valor.VAL_LIQUIDO.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                                                                    </td>
                                                                    <td>
                                                                        <Link className={"btn btn-primary btn-sm"} to={`/contracheque/${plano.CD_PLANO}/${valor.DT_REFERENCIA.replace(new RegExp('/', 'g'), '.')}/${valor.CD_TIPO_FOLHA}` }>Detalhar</Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>

                                            </table>
                                        }

                                        {plano.contracheque.length === 0 && 
                                            <div>Nenhum contracheque disponível para este plano.</div>
                                        }
                                    </Box>
                                </Col>
                            </Row>
                        )
                    })
                }

            </Page>
        );
    }
}
