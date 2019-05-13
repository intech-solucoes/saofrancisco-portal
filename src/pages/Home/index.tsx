import React, { Component } from "react";
import { Page } from "../";

import { PlanoService } from "@intechprev/prevsystem-service";
import { HomeAtivo } from "./HomeAtivo";
import { HomeAssistido } from "./HomeAssistido";
import { HomePensionista } from "./HomePensionista";

interface Props { }

interface State {
    plano: Array<any>;
    pensionista: boolean;
}

export class Home extends Component<Props, State>  {

    constructor(props: Props) {
        super(props);

        this.state = {
            plano: [
                {}
            ],
            pensionista: localStorage.getItem("pensionista") === "true"
        };
    }

    componentDidMount = async () => {
        var plano = await PlanoService.Buscar();
        console.log(plano);
        await this.setState({ plano });
    }

    render() {
        if(this.state.pensionista)
            return <HomePensionista {...this.props} />
        else if(this.state.plano[0].CD_CATEGORIA === "1")
            return <HomeAtivo {...this.props} />
        else if(this.state.plano[0].CD_CATEGORIA === "4")
            return <HomeAssistido {...this.props} />
        else
            return <Page {...this.props} />;
    }
}