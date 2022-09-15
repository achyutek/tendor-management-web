export function restrictToAlphabets(event: any) {
    const re = /[a-zA-Z]+/g;
    if (!re.test(event.key)) {
        event.preventDefault();
    }
}

export function restrictToNumbers(event: any) {
    const re = /[0-9]+/g;
    if (!re.test(event.key)) {
        event.preventDefault();
    }
}

export function restrictToDecimals(event: any) {
    const re = /[0-9.]+/g;
    if (!re.test(event.key) && event.keyCode !== 8) {
        event.preventDefault();
    }
}
