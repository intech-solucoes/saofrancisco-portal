import React, { Component } from "react";
import { Page } from "../";

import { PlanoService, ProcessoBeneficioService } from "@intechprev/prevsystem-service";
import { HomeAtivo } from "./HomeAtivo";
import { HomeAssistido } from "./HomeAssistido";
import { HomePensionista } from "./HomePensionista";
import { HomeAtivoSaldado } from "./HomeAtivoSaldado";
import { Combo } from "@intechprev/componentes-web";
import _ from "lodash";

interface Props {
    match?: any;
    cdPlano?: string;
}

interface State {
    planos: Array<any>;
    plano: any;
    cdPlano: string;
    processosBeneficio: any;
    processo: any;
    pensionista: boolean;
    especieAnoNumProcesso: string;
}

export class Home extends Component<Props, State>  {

    public page = React.createRef<Page>();
    public homeAssistido = React.createRef<HomeAssistido>();
    public homeAtivo = React.createRef<HomeAtivo>();

    constructor(props: Props) {
        super(props);

        this.state = {
            planos: [
                {}
            ],
            plano: {},
            cdPlano: "",
            processosBeneficio: {},
            processo: {},
            especieAnoNumProcesso: "",
            pensionista: localStorage.getItem("pensionista") === "true"
        };
    }

    componentDidMount = async () => {
        var planos = await PlanoService.Buscar();
        
        var plano = planos[0];
        var cdPlano = plano.CD_PLANO;

        if(plano.CD_CATEGORIA === "4") {
            var processosBeneficio = await ProcessoBeneficioService.BuscarPorPlano(planos[0].CD_PLANO);
        
            if(processosBeneficio.length > 0) {
                var processo = processosBeneficio[0];
                var especieAnoNumProcesso = processo.CD_ESPECIE + processo.ANO_PROCESSO + processo.NUM_PROCESSO;
                
                await this.setState({
                    processosBeneficio,
                    processo,
                    especieAnoNumProcesso
                });
            }
        }
        
        await this.setState({ 
            planos,
            plano,
            cdPlano
        });
    }

    carregarPlano = async () => {
        var plano = null;
        var cdPlano = "";
        
        if(this.state.cdPlano)
            plano = _.filter(this.state.planos, (plano: any) => plano.CD_PLANO === this.state.cdPlano)[0];
        else
            plano = this.state.planos[0];

        cdPlano = plano.CD_PLANO;

        await this.setState({
            plano,
            cdPlano
        });

        if(this.homeAtivo.current)
            await this.homeAtivo.current.selecionarPlano(plano);
    }

    carregarProcesso = async () => {
        var processo = null;
        var especieAnoNumProcesso = "";
        
        if(this.state.especieAnoNumProcesso)
            processo = _.filter(this.state.processosBeneficio, (processo: any) => processo.CD_ESPECIE + processo.ANO_PROCESSO + processo.NUM_PROCESSO === this.state.especieAnoNumProcesso)[0];
        else
            processo = this.state.processosBeneficio[0];

        especieAnoNumProcesso = processo.CD_ESPECIE + processo.ANO_PROCESSO + processo.NUM_PROCESSO;

        if(await this.homeAssistido.current)
            await this.homeAssistido.current.selecionarProcesso(processo);

        await this.setState({
            processo,
            especieAnoNumProcesso
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

                {this.state.processosBeneficio.length > 1 &&
                    <Combo contexto={this} label={"Selecione um processo de benefício"} onChange={this.carregarProcesso}
                            nome={"especieAnoNumProcesso"} valor={this.state.especieAnoNumProcesso} obrigatorio
                            opcoes={this.state.processosBeneficio} nomeMembro={"DS_PROCESSO"} valorMembro={"ESPECIE_ANO_NUM_PROCESSO"} />
                }

                {this.state.plano.CD_PLANO === "0003" && (this.state.plano.CD_CATEGORIA === "1" || this.state.plano.CD_CATEGORIA === "3")  &&
                    <HomeAtivoSaldado {...this.props} page={this.page} />
                }
                {this.state.plano.CD_PLANO !== "0003" && (this.state.plano.CD_CATEGORIA === "1" || this.state.plano.CD_CATEGORIA === "3") &&
                    <HomeAtivo ref={this.homeAtivo} {...this.props} page={this.page} plano={this.state.plano} />
                }
                {this.state.plano.CD_CATEGORIA === "4" &&
                    <HomeAssistido ref={this.homeAssistido} {...this.props} page={this.page} processo={this.state.processo} />
                }
            </Page>
        )
    }
}