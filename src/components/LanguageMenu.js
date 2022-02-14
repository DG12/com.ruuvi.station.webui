import React, { Component } from "react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
} from "@chakra-ui/react"
import { MdArrowDropDown } from "react-icons/md"
import NetworkApi from "../NetworkApi";
import { withTranslation } from 'react-i18next';
import { uppercaseFirst } from "../TextHelper";
import { ruuviTheme } from "../themes";

class LanguageMenu extends Component {
    seeSettings = () => {
        new NetworkApi().getSettings(settings => {
            alert(JSON.stringify(settings, null, 2))
        })
    }
    seeAlerts = () => {
        new NetworkApi().getAlerts(alerts => {
            alert(JSON.stringify(alerts, null, 2))
        })
    }
    langChange = (lng) => {
        localStorage.setItem("selected_language", lng)
        this.props.i18n.changeLanguage(lng);
    }
    render() {
        const { i18n } = this.props;
        if (this.props.loginPage) {
            return (
                <>
                    {["en", "fi", "sv"].map(x => {
                        return <span key={x} style={{ fontFamily: "mulish", margin: 6, fontSize: 16, fontWeight: "bold", cursor: "pointer", textDecoration: (i18n.language || "en") === x ? "underline" : "" }} onClick={() => this.langChange(x)}>{uppercaseFirst(x)}</span>
                    })}
                </>
            )
        }
        return (
            <Menu autoSelect={false}>
                <MenuButton disabled={false} as={Button} variant="ddl"  rightIcon={<MdArrowDropDown size={20} color="#77cdc2" style={{ margin: -4 }} />} style={{ backgroundColor: "transparent", fontFamily: "mulish", fontSize: 16, fontWeight: "bold", paddingRight: 0  }}>
                    {uppercaseFirst(i18n.language || "en")}
                </MenuButton>
                <MenuList mt="2">
                    {["en", "fi", "sv"].map(x => {
                        return <MenuItem key={x} style={{ fontFamily: "mulish", fontSize: 16, fontWeight: "bold", backgroundColor: i18n.language === x ? ruuviTheme.colors.primaryLight : undefined }}_hover={{ bg: "primaryLighter" }} onClick={() => this.langChange(x)}>{uppercaseFirst(x)}</MenuItem>
                    })}
                </MenuList>
            </Menu>
        )
    }
}

export default withTranslation()(LanguageMenu);