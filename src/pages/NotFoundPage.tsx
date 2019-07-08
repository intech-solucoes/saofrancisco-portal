import React from "react";
import { Link } from "react-router-dom";

export class NotFoundPage extends React.Component {
    render() {
        return (
            <div style={{ textAlign: "center", marginTop: 100, color: "#a9abad" }}> 
                <h1 style={{ fontSize: 120 }}>404</h1>
                <h4 style={{ marginBottom: 40 }}>Página não encontrada!</h4>

                <Link to="/">Voltar</Link>
            </div>
        );
    }
}