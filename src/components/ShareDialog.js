import React, { Component } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    List,
    ListItem,
    ListIcon,
    Progress,
    IconButton,
} from "@chakra-ui/react"
import { withTranslation } from 'react-i18next';
import { MdClear, MdClose } from "react-icons/md";
import NetworkApi from "../NetworkApi";
import notify from "../utils/notify";

const maxSharesPerSensor = 10;

class ShareDialog extends Component {
    constructor(props) {
        super(props)
        this.state = { email: "", loading: false }
    }
    share() {
        this.setState({ ...this.state, loading: true })
        new NetworkApi().share(this.props.sensor.sensor, this.state.email, resp => {
            var newState = this.state;
            switch (resp.result) {
                case "success":
                    if (!resp.data.invited) {
                        var sensor = this.props.sensor;
                        sensor.sharedTo.push(this.state.email);
                        this.props.updateSensor(sensor)
                    }
                    notify.success(this.props.t("successfully_shared"))
                    newState.email = "";
                    break
                case "error":
                    notify.error(this.props.t(`UserApiError.${resp.code}`))
                    break;
                default:
            }
            newState.loading = false;
            this.setState(newState)
        })
    }
    unshare(email) {
        if (this.state.loading) return;
        var confirmMessage = this.props.t("share_sensor_unshare_confirm").replace("{%@^%1$s}", email)
        if (window.confirm(confirmMessage)) {
            this.setState({ ...this.state, loading: true })
            new NetworkApi().unshare(this.props.sensor.sensor, email, resp => {
                var newState = this.state;
                switch (resp.result) {
                    case "success":
                        var sensor = this.props.sensor;
                        sensor.sharedTo = sensor.sharedTo.filter(x => x !== email)
                        notify.success(this.props.t(`successfully_unshared`))
                        this.props.updateSensor(sensor)
                        break
                    case "error":
                        notify.error(this.props.t(`UserApiError.${resp.code}`))
                        break;
                    default:
                }
                newState.loading = false;
                this.setState(newState)
            })
        }
    }
    emailHandler(evt) {
        this.setState({ ...this.state, email: evt.target.value });
    }
    render() {
        if (!this.props.sensor || !this.props.sensor.canShare) return <></>
        var { t } = this.props;
        return (
            <>
                <Modal isOpen={this.props.open} onClose={this.props.onClose} size="xl" isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader style={{ marginTop: 15 }}>{t("share_sensor_title")}</ModalHeader>
                        <ModalCloseButton style={{ margin: 15 }}>
                            <IconButton isRound={true} style={{ backgroundColor: "#f0faf9", color: "#26ccc0" }}><MdClose /></IconButton>
                        </ModalCloseButton>
                        <ModalBody mb="3">
                            {t("share_sensor_description").split("\\n").map((x, i) => <div key={i}>{x}<br /></div>)}
                            <br />
                            <div style={{ fontFamily: "Montserrat", fontWeight: 800 }}>{t("share_sensor_add_friend")}</div>
                            <Input autoFocus placeholder={t("email")} type="email" value={this.state.email} onChange={this.emailHandler.bind(this)} mt="10px" mb="10px" />
                            <div style={{ textAlign: "right" }}>
                                <Button disabled={this.state.loading || this.props.sensor.sharedTo.length >= maxSharesPerSensor || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)} onClick={this.share.bind(this)} mt="2">{t("share")}</Button>
                            </div>
                            {this.props.sensor.sharedTo.length > 0 && <>
                                <div style={{ fontWeight: "bold" }}>{t("share_sensor_already_shared")} {this.props.sensor.sharedTo.length}/{maxSharesPerSensor}</div>
                                <List spacing={3}>
                                    {this.props.sensor.sharedTo.map(x => {
                                        return <ListItem key={x}>
                                            <ListIcon as={MdClear} color="gray" style={{ cursor: "pointer" }} onClick={() => this.unshare(x)} />
                                            {x}
                                        </ListItem>
                                    })}
                                </List>
                            </>
                            }
                            {this.state.loading && <Progress isIndeterminate={true} color="#e6f6f2" />}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        )
    }
}

export default withTranslation()(ShareDialog);