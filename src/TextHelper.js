export function uppercaseFirst(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addNewlines(str) {
    return str.split("\n").map((x, i) => <p style={{marginTop: i > 0 ? 10 : undefined}} key={Math.random()}>{x}</p>)
}