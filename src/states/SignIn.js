import React, { Component } from "react";
import logo from '../img/ruuvi-logo.png'
import NetworkApi from '../NetworkApi'
import { Center } from "@chakra-ui/react"
import { Stack, Image } from "@chakra-ui/react"
import { Input, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { CircularProgress, SlideFade } from "@chakra-ui/react"

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            validationCode: "",
            pageState: 0,
            loading: false,
        }
    }
    register() {
        this.setState({ ...this.state, loading: true })
        new NetworkApi().register(this.state.email, resp => {
            if (resp.result === "error") {
                alert(resp.error)
                this.setState({ ...this.state, pageState: 0, loading: false })
                return
            }
            this.setState({ ...this.state, pageState: 1, loading: false })
        }, () => {
            alert("Network error")
            this.setState({ ...this.state, pageState: 0, loading: false })
        })
    }
    validate() {
        this.setState({ ...this.state, loading: true })
        var api = new NetworkApi();
        api.verify(this.state.validationCode, resp => {
            if (resp.result === "error") {
                alert(resp.error)
                this.setState({ ...this.state, pageState: 0, loading: false, validationCode: "" })
                return
            }
            var user = resp.data;
            api.setUser(user)
            this.props.loginSuccessful(user)
        }, () => {
            alert("Network error")
            this.setState({ ...this.state, pageState: 0, loading: false })
        })
    }
    render() {
        return (
            <Center>
                <Stack spacing="24px">
                    <Image alt="logo" src={logo} fit="scale-down" />
                    {this.state.loading ? (
                        <SlideFade initialScale={1} in={this.state.loading} unmountOnExit style={{ textAlign: "center" }}>
                            <CircularProgress isIndeterminate color="teal" />
                        </SlideFade>
                    ) : (
                        <span>
                            {this.state.pageState === 0 &&
                                <SlideFade initialScale={1} in={this.state.pageState === 0} unmountOnExit>
                                    <Stack spacing="12px">
                                        <Text>
                                            Login to Ruuvi Network {new NetworkApi().isStaging() ? "(staging)" : ""}
                                        </Text>
                                        <Input placeholder="Email" value={this.state.email} onChange={e => this.setState({ ...this.state, email: e.target.value })} />
                                        <Button colorScheme="teal" onClick={this.register.bind(this)}>Login / Register</Button>
                                    </Stack>
                                </SlideFade>
                            }
                            {this.state.pageState === 1 &&
                                <SlideFade initialScale={0} in={this.state.pageState === 1} unmountOnExit>
                                    <Stack spacing="12px">
                                        <Text>
                                            Check your mail, and enter the code here.
                                        </Text>
                                        <Input placeholder="Validation code" value={this.state.validationCode} onChange={e => this.setState({ ...this.state, validationCode: e.target.value })} />
                                        <Button colorScheme="teal" onClick={this.validate.bind(this)}>Submit</Button>
                                    </Stack>
                                </SlideFade>
                            }
                        </span>
                    )}
                </Stack>
            </Center>
        )
    }
}

export default SignIn;