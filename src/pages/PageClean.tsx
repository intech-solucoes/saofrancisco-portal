import React, { Component } from "react";

interface Props {
	tamanho?: number;
}

export default class PageClean extends Component<Props> {

	render() {
		return (
			<div className="panel-login middle-box"
				style={{
					width: this.props.tamanho
				}}>
				<div className="logo">
                    <img src="./imagens/logo.png" alt="Logo" />
                </div>

				{this.props.children}
			</div>
		)
	}
}