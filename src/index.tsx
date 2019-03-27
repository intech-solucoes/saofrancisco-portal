import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from "react-router-dom";

const Rotas = require(`./Rotas`).default;
//const RotasAdmin = require(`./pages/_admin/Rotas`).default;

class MainRender extends React.Component {
	render() {
		return (
			<HashRouter>
				<Switch>
					{ Rotas.map((rota: any, index: number) => <Route key={index} exact={rota.exact} path={rota.caminho} component={rota.componente} />) }
					{/* { RotasAdmin.map((rota: any, index: number) => <Route key={index} exact={rota.exact} path={rota.caminho} component={rota.componente} />) } */}
				</Switch>
			</HashRouter>
		);
	}
}

ReactDOM.render(<MainRender />, document.getElementById('root'));