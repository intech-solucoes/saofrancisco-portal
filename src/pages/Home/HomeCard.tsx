import React, { ReactNode, ReactNodeArray } from "react";

interface Props {
    titulo: string;
    label?: string;
    children: ReactNode | ReactNodeArray;
}

export class HomeCard extends React.Component<Props> {

    render() {
        return (
            <div className="card mb-3">
                <div className={"card-title"}>
                    {this.props.titulo}

                    {this.props.label &&
                        <span className={"badge badge-secondary"}>{this.props.label}</span>
                    }
                </div>
                
                <div className={"card-content"}>
                    {this.props.children}
                </div>
            </div>
        );
    }

}