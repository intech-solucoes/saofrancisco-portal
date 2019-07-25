import React, { Component } from "react";
import { Page } from "../";

import { PlanoService } from "@intechprev/prevsystem-service";
import { HomeAtivo } from "./HomeAtivo";
import { HomeAssistido } from "./HomeAssistido";
import { HomePensionista } from "./HomePensionista";
import { HomeAtivoSaldado } from "./HomeAtivoSaldado";
import { Combo } from "@intechprev/componentes-web";
import _ from "lodash";

interface Props { }

interface State {
    planos: Array<any>;
    plano: any;
    cdPlano: string;
    pensionista: boolean;
}

export class Home extends Component<Props, State>  {

    public page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: [
                {}
            ],
            plano: {},
            cdPlano: "",
            pensionista: localStorage.getItem("pensionista") === "true"
        };
    }

    componentDidMount = async () => {
        var planos = await PlanoService.Buscar();
        await this.setState({ 
            planos,
            plano: planos[0],
            cdPlano: planos[0].CD_PLANO
         });
    }

    carregarPlano = async () => {
        var plano = _.filter(this.state.planos, (plano: any) => plano.CD_PLANO === this.state.cdPlano)[0];

        await this.setState({
            plano
        });
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.state.planos.length > 1 &&
                    <Combo contexto={this} label={"Selecione um plano"} onChange={this.carregarPlano}
                            nome={"cdPlano"} valor={this.state.cdPlano} obrigatorio
                            opcoes={this.state.planos} nomeMembro={"DS_PLANO"} valorMembro={"CD_PLANO"} />
                }

                {this.state.plano.CD_PLANO === "0003" && this.state.plano.CD_CATEGORIA === "1" &&
                    <HomeAtivoSaldado {...this.props} page={this.page} />
                }
                {this.state.plano.CD_PLANO !== "0003" && this.state.plano.CD_CATEGORIA === "1" &&
                    <HomeAtivo {...this.props} page={this.page} />
                }
                {this.state.plano.CD_CATEGORIA === "4" &&
                    <HomeAssistido {...this.props} page={this.page} />
                }
            </Page>
        )
    }
}