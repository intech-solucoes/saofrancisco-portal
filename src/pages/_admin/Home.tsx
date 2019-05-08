import React, { Component } from 'react'

import PageAdmin from "./PageAdmin";

import { Row, Col } from "@intechprev/componentes-web";

export default class Home extends Component {
    page = React.createRef<PageAdmin>();

    render() {
        return (
            <PageAdmin {...this.props} ref={this.page}>
                


            </PageAdmin>
        )
    }
}