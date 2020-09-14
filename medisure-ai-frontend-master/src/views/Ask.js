/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FormData from "form-data";
import React from "react";
import ReactDOM from "react-dom";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardDeck,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";

// const URL = "http://localhost:5000/summary";
const URL = "https://backend-nlstr4buia-uc.a.run.app/summary";

class Ask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      qText: "",
    };
    this.onChange.bind(this);
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  async sendQuery(qText, hash) {
    // Send query
    console.log(qText);
    const response = await axios.post(URL, { data: qText });
    const message = {
      user: false,
      message: response.data.substring("output: ".length),
    };
    this.setState({
      messages: [...this.state.messages, message],
    });
  }

  askSubmit(e) {
    e.preventDefault();
    if (this.state.qText) {
      const message = {
        user: true,
        message: this.state.qText,
      };
      this.setState({
        messages: [...this.state.messages, message],
      });
      if (this.askForm) {
        ReactDOM.findDOMNode(this.askForm).reset();
      }
      this.sendQuery(this.state.qText, this.state.responseHash);
      this.setState({
        qText: "",
      });
    }
  }

  render() {
    return (
      <>
        <div className='content'>
          <Row lg='6' className='mt-3 justify-content-lg-center'>
            <Col lg='8'>
              <Card>
                <CardHeader>
                  <CardTitle tag='h3'>
                    <i className='tim-icons icon-double-right text-success' />
                    Ask
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className='border border-dark rounded p-3 text-light mb-2'>
                    {this.state.messages.map((message, idx) => {
                      if (message.user) {
                        return (
                          <Row lg={12} className='justify-content-lg-end'>
                            <Col lg={6}>
                              <div
                                className='border border-success rounded ml-2 p-2 pl-4 mb-1 text-dark'
                                style={{ borderRadius: "30%" }}
                              >
                                {message.message}
                              </div>
                            </Col>
                          </Row>
                        );
                      } else {
                        return (
                          <Row lg={12} className='justify-content-lg-start'>
                            <Col lg={6}>
                              <div
                                className='border border-primary rounded ml-2 p-2 pl-4 mb-1 text-dark'
                                style={{ borderRadius: "30%" }}
                              >
                                {message.message}
                              </div>
                            </Col>
                          </Row>
                        );
                      }
                    })}
                  </div>
                  <Form
                    onSubmit={this.askSubmit.bind(this)}
                    ref={(form) => (this.askForm = form)}
                  >
                    <FormGroup className='has-feedback'>
                      <Input
                        type='text'
                        name='qText'
                        id='inputText'
                        placeholder='Ask me anything!'
                        onChange={this.onChange}
                        innerRef={this.state.qText}
                      />
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className='form-control-feedback text-success'
                        onClick={this.askSubmit.bind(this)}
                        style={{ cursor: "pointer" }}
                      />
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Ask;
