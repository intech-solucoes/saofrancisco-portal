import React from "react";

import Modal from "./Modal";

interface Props {
    mostrarDados: boolean,
    mensagens: any
}

interface State {
    mensagens: any
}

export default class ListaMensagens extends React.Component<Props, State> {

    static defaultProps = {
        mostrarDados: true
    };

    private modal = React.createRef<Modal>();

    constructor(props: Props) {
        super(props);
    }

    /**
     * @description Renderizar uma badge de acordo com os parâmetros recebidos. A badge informa que a mensagem foi enviada por tal via caso esteja renderizada.
     * @param {string} badgeVisivel No banco, o valor que informa que tal mensagem foi enviada por tal via é "SIM" ou "NAO". A string badgeVisivel informa se a 
     * mensagem foi enviada por um tipo de meio, por isso, para true ("SIM") a badge é renderizada, caso contrário a badge não é renderizada.
     * @param {string} tipoBadge String com o valor do tipo (cor) da badge.
     * @param {string} nomeBadge String com o valor do texto da badge.
     * @returns Div com a badge com cor e nome recebidos.
     */
    renderBadge(badgeVisivel: string, tipoBadge: string, nomeBadge: string) {
        if(badgeVisivel === "SIM") {
            return (
                <div className="btn-group mr-2">
                    <label className={"badge badge-" + tipoBadge}>{nomeBadge}</label>
                </div>
            )
        } else if(badgeVisivel === "NAO")
            return null
    }

    render() {
        return (
            <div>
                <Modal ref={this.modal} mostrarDados={this.props.mostrarDados} />

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Data de criação</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.mensagens.map((mensagem: any, index: number) => {
                                return (
                                    <tr key={index}>

                                        <td className="align-middle" style={{ width: 50 }}>
                                            <button id={"mensagem-" + mensagem.OID_MENSAGEM} className="btn btn-link" onClick={() => this.modal.current.toggleModal(mensagem)}><i className="fa fa-search"></i></button>
                                        </td>

                                        <td className="align-middle" style={{ width: 120 }}>
                                            {mensagem.DTA_MENSAGEM}
                                        </td>

                                        <td className="align-middle">
                                            {this.props.mostrarDados &&
                                                <div>
                                                    {this.renderBadge(mensagem.IND_PORTAL, "success", "Portal")}
                                                    {this.renderBadge(mensagem.IND_EMAIL, "danger", "E-mail")}
                                                </div>
                                            }

                                            {mensagem.TXT_TITULO}
                                        </td>

                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}