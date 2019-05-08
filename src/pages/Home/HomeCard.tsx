import React from "react";

interface Props {
    titulo: string;
    conteudo: string;
}

export class HomeCard extends React.Component<Props> {

    render() {
        return (
            <div className="card text-white" style={{ backgroundColor: "#13AAEE", textAlign: 'center', borderRadius: 80, padding: 5 }}>
                <h6>{this.props.titulo}</h6>
                <h4>{this.props.conteudo}</h4>
            </div>
        );
    }

}