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
import React from "react";
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
  Label,
  Spinner,
} from "reactstrap";
import axios from "axios";
import FormData from "form-data";

// const URL = "http://localhost:5000/denial";
const URL = "https://backend-nlstr4buia-uc.a.run.app/denial";

class Letter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileLoading: false,
      formLoading: false,
      responseLetter: "",
    };
    this.onFileUpload.bind(this);
  }
  onFileUpload = (e) => {
    const file = e.target.files[0];
    this.inputSubmit(file);
  };
  async inputSubmit(file) {
    this.setState({
      fileLoading: true,
    });
    // Send file
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(URL, formData);
      const data = response.data;
      console.log(data);
      function parseDate(dateString) {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        let mm = date.getMonth();
        if (mm < 10) {
          mm = "0" + mm;
        }
        let dd = date.getDate();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
          return undefined;
        }
        return `${yyyy}-${mm}-${dd}`;
      }
      this.setState({
        fileLoading: false,
        name: data["Patient Name"],
        age: data["Age"],
        dateDiagnosis: parseDate(data["Diagnosis Date"]),
        treatment: data["Treatment/procedure name"],
        treatmentStart: parseDate(data["Treatment Date"]),
        condition: data["Condition"],
        insurancePlan: data["Insurance Plan"],
        treatmentHospital: data["Hospital"],
        treatmentDoctor: data["Supervising Doctor"],
        inNetwork: data["In-network provider"],
        state: data["Patient Plan State"],
        lifeThreatening: data["Life-threatening urgency"],
        reasonDenial: data["Reason"],
      });
      console.log(this.state);
    } else {
      this.setState({
        fileLoading: false,
      });
    }
    console.log("Done");
  }
  async formSubmit(e) {
    e.preventDefault();
    this.setState({
      formLoading: true,
    });
    console.log(this.state);
    const formData = new FormData();
    for (let key of Object.keys(this.state)) {
      // Skip loading states
      if (["fileLoading", "formLoading", "responseLetter"].includes(key)) {
        continue;
      }
      console.log("Appending", key, this.state[key]);
      formData.append(key, this.state[key]);
    }
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    const json = JSON.stringify(object);
    console.log(json);
    const response = await axios.post(URL + "/generate", json);
    this.setState({
      formLoading: false,
      responseLetter: response.data,
    });
    console.log(response.data);
  }
  render() {
    const labelSize = 4;
    const inputSize = 8;
    return (
      <>
        <div className='content'>
          <Row lg='12'>
            <Col lg='12'>
              <CardDeck lg='6'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-double-right text-success' />
                      Information
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={this.inputSubmit.bind(this)}>
                      <FormGroup row>
                        <Label for='srcFile' tag='h4' lg={labelSize}>
                          Upload denial letter
                        </Label>
                        <Col lg={6}>
                          <Input
                            type='file'
                            name='srcFile'
                            id='srcFile'
                            className='mt-2'
                            onChange={this.onFileUpload}
                          />
                        </Col>
                        <Col lg={1}>
                          {this.state.fileLoading ? (
                            <Spinner color='light' className='mt-2' />
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Form>
                    <Form onSubmit={this.formSubmit.bind(this)}>
                      <FormGroup row>
                        <Label for='input-name' tag='h4' lg={labelSize}>
                          Patient Name
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='name'
                            id='input-name'
                            placeholder='Alice Smith'
                            value={this.state.name}
                            onChange={(e) =>
                              this.setState({
                                name: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for='input-age' tag='h4' lg={labelSize}>
                          Patient Age
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='age'
                            id='input-age'
                            placeholder='34'
                            value={this.state.age}
                            onChange={(e) =>
                              this.setState({
                                age: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-date-diagnosis'
                          tag='h4'
                          lg={labelSize}
                        >
                          Date of Diagnosis
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='date'
                            name='dateDiagnosis'
                            id='input-date-diagnosis'
                            value={this.state.dateDiagnosis}
                            onChange={(e) =>
                              this.setState({
                                dateDiagnosis: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for='input-treatment' tag='h4' lg={labelSize}>
                          Treatment
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='treatment'
                            id='input-treatment'
                            placeholder='Complete Decongestive Therapy CDT (Therapy), Specialized Liposuction (Surgery)'
                            value={this.state.treatment}
                            onChange={(e) =>
                              this.setState({
                                treatment: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-treatment-start'
                          tag='h4'
                          lg={labelSize}
                        >
                          Start of Treatment
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='date'
                            name='treatmentStart'
                            id='input-treatment-start'
                            value={this.state.treatmentStart}
                            onChange={(e) =>
                              this.setState({
                                treatmentStart: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for='input-condition' tag='h4' lg={labelSize}>
                          Condition
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='condition'
                            id='input-condition'
                            placeholder='Lipedema'
                            value={this.state.condition}
                            onChange={(e) =>
                              this.setState({
                                condition: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-insurance-plan'
                          tag='h4'
                          lg={labelSize}
                        >
                          Insurance Plan
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='insurancePlan'
                            id='input-insurance-plan'
                            placeholder='Aetna MD Bronze PPO'
                            value={this.state.insurancePlan}
                            onChange={(e) =>
                              this.setState({
                                insurancePlan: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-treatment-hospital'
                          tag='h4'
                          lg={labelSize}
                        >
                          Treatment Hospital
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='treatmentHospital'
                            id='input-treatment-hospital'
                            placeholder='San Francisco General Hospital'
                            value={this.state.treatmentHospital}
                            onChange={(e) =>
                              this.setState({
                                treatmentHospital: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-treatment-doctor'
                          tag='h4'
                          lg={labelSize}
                        >
                          Treatment Doctor
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='treatmentDoctor'
                            id='input-treatment-doctor'
                            placeholder='Dr. John Smith'
                            value={this.state.treatmentDoctor}
                            onChange={(e) =>
                              this.setState({
                                treatmentDoctor: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for='input-in-network' tag='h4' lg={labelSize}>
                          In network treatment provider?
                        </Label>
                        <Col lg={inputSize} className='my-3'>
                          <Input
                            type='checkbox'
                            name='inNetwork'
                            id='input-in-network'
                            className='ml-2'
                            checked={this.state.inNetwork}
                            onChange={(e) =>
                              this.setState({
                                inNetwork: e.target.checked,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for='input-state' tag='h4' lg={labelSize}>
                          State
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='state'
                            id='input-state'
                            placeholder='CA'
                            value={this.state.state}
                            onChange={(e) =>
                              this.setState({
                                state: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-life-threatening'
                          tag='h4'
                          lg={labelSize}
                        >
                          Life-threatening Condition?
                        </Label>
                        <Col lg={inputSize} className='my-3'>
                          <Input
                            type='checkbox'
                            name='lifeThreatening'
                            id='input-life-threatening'
                            className='ml-2'
                            checked={this.state.lifeThreatening}
                            onChange={(e) =>
                              this.setState({
                                lifeThreatening: e.target.checked,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for='input-reason-denial'
                          tag='h4'
                          lg={labelSize}
                        >
                          Reason for Denial
                        </Label>
                        <Col lg={inputSize}>
                          <Input
                            type='text'
                            name='reasonDenial'
                            id='input-reason-denial'
                            placeholder='Considered cosmetic treatment'
                            value={this.state.reasonDenial}
                            onChange={(e) =>
                              this.setState({
                                reasonDenial: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </FormGroup>
                      <Button type='submit' className='btn btn-success'>
                        Generate
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Row>
                      <CardTitle tag='h3' className='ml-3'>
                        <i className='tim-icons icon-double-right text-primary' />
                        Denial Appeal Letter
                      </CardTitle>
                      {this.state.formLoading ? (
                        <Spinner color='light' className='mt-2 ml-lg-5' />
                      ) : null}
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className='border border-primary rounded p-3 text-dark'>
                      {this.state.responseLetter.split("\n").map((line) => {
                        return <p>{line}</p>;
                      })}
                    </div>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Letter;
