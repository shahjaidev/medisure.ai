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
import React from "react"
// reactstrap components
import {
  Card,
  CardDeck,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Row,
} from "reactstrap"

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bigChartData: "data1",
    }
  }
  setBgChartData = (name) => {
    this.setState({
      bigChartData: name,
    })
  }
  render() {
    return (
      <>
        <div className="content">
          <Row lg="6" className="justify-content-lg-center">
            <Col lg="12">
              <Card className="mx-auto">
                <CardHeader>
                  <CardTitle tag="h3" className="text-center">
                    Medisure.ai
                  </CardTitle>
                </CardHeader>
                <hr />
                <CardBody className="text-center">
                  A consolidated suite of deep-learning powered NLP tools to
                  help demystify medical insurance and generate insurance claim
                  denial appeals
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row lg="6" className="justify-content-lg-center">
            <Col lg="12">
              <CardDeck lg="12">
                <Card className="mx-2">
                  <CardHeader>
                    <CardTitle tag="h3">
                      Personalized Medical Insurance Plan Assistant
                    </CardTitle>
                  </CardHeader>
                  <hr />
                  <CardBody className="">
                    <ul>
                      <li style={{ color: "#525f7f" }}>
                        Upload a Statement of Benefits and Coverage Document
                        (e.g. Aetna Bronze, Cigma MD PPO)
                      </li>
                      <li style={{ color: "#525f7f" }}>
                        Google Cloud Document API extracts text and tables from
                        document
                      </li>
                      <li style={{ color: "#525f7f" }}>
                        GPT-3 enables users in natural language and get
                        responses customized for their insurance policy
                      </li>
                    </ul>
                  </CardBody>
                </Card>
                <Card className="mx-2">
                  <CardHeader>
                    <CardTitle tag="h3">
                      Insurance Claim Appeal Letter Generation
                    </CardTitle>
                  </CardHeader>
                  <hr />
                  <CardBody className="">
                    Medisure.ai asks the user to upload the denial notice they
                    received from their insurance provider. Leveraging the
                    Google Cloud Document API, from the converted text, we use a
                    combination of tf-idf summarization and gpt-3 to mine the
                    denial argument along with details about the patient, plan
                    and procedure. Using these fields, we generate a
                    professional, detailed, human-like claim denial appeal
                    letter for the patient to use.
                  </CardBody>
                </Card>
                <Card className="mx-2">
                  <CardHeader>
                    <CardTitle tag="h3" style={{ marginBottom: "1.9em" }}>
                      Chrome Extension
                    </CardTitle>
                  </CardHeader>
                  <hr />
                  <CardBody className="">
                    Medical insurance policy documents are often highly
                    convoluted and full of uncommon legal vocabulary. Sometimes,
                    you may need to dive deep into these to gain more
                    information. We simplify this for you, enabling people
                    without the domain knowledge or exposure to understand the
                    clauses and make informed decisions, or argue their case for
                    an appeal if they need to.
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          </Row>
          <Row lg="6" className="justify-content-lg-center mt-4">
            <Col lg="12">
              <Card className="mx-auto">
                <CardHeader className="justify-content-center">
                  <CardTitle tag="h3" className="text-center">
                    Developers
                  </CardTitle>
                </CardHeader>
                <hr />
                <CardBody className="text-center">
                  Abhijit Gupta
                  <br />
                  Gram Liu
                  <br />
                  Jaidev Shah
                  <br />
                  Shivay Lamba
                  <br />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default Home
