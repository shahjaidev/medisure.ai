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
  Spinner,
} from "reactstrap";

// const URL = "http://localhost:5000/vision"
const URL = "https://backend-nlstr4buia-uc.a.run.app/vision";
const prefixLen = "output: ".length;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qText: "",
      responseHash: "",
      summary: "",
      messages: [],
      uploadLoading: false,
      summaryLoading: false,
    };
    this.askForm = null;
    this.onChange.bind(this);
    this.onFileUpload.bind(this);
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onFileUpload = (e) => {
    this.setState({
      srcFile: e.target.files[0],
    });
  };

  async inputSubmit(e) {
    this.setState({
      uploadLoading: true,
    });
    e.preventDefault();
    // Send file
    if (this.state.srcFile) {
      const formData = new FormData();
      formData.append("file", this.state.srcFile);
      const response = await axios.post(URL, formData);
      const hash = response.data;
      this.setState({
        responseHash: hash,
        uploadLoading: false,
      });
      console.log("Hash", hash);
      this.getSummary(hash);
    } else {
      this.setState({
        uploadLoading: false,
      });
    }
  }

  async sendQuery(qText, hash) {
    // Send query
    const response = await axios.post(
      URL + "/qa",
      { data: qText },
      {
        params: {
          doc: hash,
        },
      }
    );
    const message = {
      user: false,
      message: response.data.substring(prefixLen),
    };
    this.setState({
      messages: [...this.state.messages, message],
    });
  }

  async getSummary(hash) {
    this.setState({
      summaryLoading: true,
    });
    const response = await axios.post(URL + "/summary", null, {
      params: {
        doc: hash,
      },
    });
    const summary = response.data.substring(prefixLen);
    console.log("Summary", summary);
    this.setState({
      summary: summary,
      summaryLoading: false,
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
          <Row lg='6'>
            <Col lg='12'>
              <CardDeck lg='6'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-double-right text-success' />
                      Source Text
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={this.inputSubmit.bind(this)}>
                      <FormGroup>
                        <Input
                          type='file'
                          name='srcFile'
                          id='srcFile'
                          className='mt-2'
                          onChange={this.onFileUpload}
                        />
                        <Row>
                          <Col lg={4}>
                            <Button type='submit' className='btn btn-success'>
                              Submit
                            </Button>
                          </Col>
                          <Col lg={4}>
                            {this.state.uploadLoading ? (
                              <Spinner color='light' className='mt-2' />
                            ) : null}
                          </Col>
                        </Row>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Row>
                      <CardTitle tag='h3' className='ml-3'>
                        <i className='tim-icons icon-double-right text-primary' />
                        Summary
                      </CardTitle>
                      {this.state.summaryLoading ? (
                        <Spinner color='light' className='mt-2 ml-5' />
                      ) : null}
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className='border border-primary rounded p-3 text-dark'>
                      {this.state.summary ? this.state.summary : ""}
                    </div>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          </Row>
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
                        className='border border-dark inputFocus'
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

export default Home;
