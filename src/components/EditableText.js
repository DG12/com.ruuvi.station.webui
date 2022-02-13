import pen from "../img/pen.svg";

function getStyledText(text) {
    var startB = text.split("<b>")
    if (startB.length === 1) return startB;
    var output = [<span key={"s" + 0}>{startB[0]}</span>];
    for (var i = 1; i < startB.length; i++) {
        var boldSplit = startB[i].split("</b>")
        output.push(<b key={"b" + i}>{boldSplit[0]}</b>)
        if (boldSplit.length > 0) output.push(<span key={"s" + i}>{boldSplit[1]}</span>)
    }
    return output;
}
export default function EditableText(props) {
    var extraStyle = {};
    if (props.spread) {
        extraStyle.display = "flex"
        extraStyle.justifyContent = "space-between"
        extraStyle.width = "100%"
    }
    return <span style={{ ...props.style, cursor: "pointer", ...extraStyle }} onClick={props.onClick}>
        <span>
            {getStyledText(props.text)}
        </span>
        <img src={pen} style={{ paddingLeft: "10px", display: "inline-block", marginBottom: 2 }} width="23px" height="13px" alt="Pen" />
    </span>
}