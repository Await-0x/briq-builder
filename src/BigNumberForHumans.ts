import { BigNumberish, toBN } from 'starknet/utils/number';

const ONE_ETH = toBN('1000000000000000000');
const GWEI_THRESHOLD = toBN('100000000000000'); // 100K GWEI
const WEI_THRESHOLD = toBN('1000000000'); // 1 GWEI

// TODO: support limited precision, which is a much harder problem in general.
export function readableNumber(number: BigNumberish) {
    const nb = toBN(number);
    if (GWEI_THRESHOLD.cmp(nb) <= 0)
        // Big enough to be shown in ETH.
        // Since the lib doesn't allow decimals, I'll just divide and print.
        try {
            return (nb.div(GWEI_THRESHOLD).toNumber() / 10000).toString();
        } catch(_) {
            // Number can't be represented in JS -> just print and cut the end.
            return nb.toString().slice(0, -18);
        }
    if (WEI_THRESHOLD.cmp(nb) <= 0)
        return nb.div(WEI_THRESHOLD).toString()
    return nb.toString();
}

export function readableUnit(number: BigNumberish) {
    const nb = toBN(number);
    if (GWEI_THRESHOLD.cmp(nb) <= 0)
        return 'ETH';
    if (WEI_THRESHOLD.cmp(nb) <= 0)
        return 'GWEI';
    return 'WEI';
}

// Reading decimals into the system isn't supported, so I have to parse it manually.
// Because this is an annoying problem and JS has no good tools to do this,
// I'll implement a basic level of support that should be mostly 'good enough'.
// Furthermore, there is no guarantee that the number will actually fit into a javascript number.
export function fromETH(numberString: string, _unit = 'ETH' as const/* | 'GWEI' | 'WEI'*/): BigNumberish {
    // Assume that the decimals will be either a dot or a comma.
    // If we run into oddities, bail out and return NaN.
    const dots = numberString.match(/\./g)?.length || 0;
    const commas = numberString.match(/,/g)?.length || 0;
    let nb: string[];
    if (dots === 1 && commas !== 1)
        nb = numberString.split('.');
    else if (commas === 1 && dots !== 1)
        nb = numberString.split(',');
    else if (commas === 0 && dots === 0)
        nb = [numberString];
    else
        return NaN;
    // This is kinda dumb on purpose
    nb = nb.map(x => x.replace(/ /g, ''));
    try {
        const output = toBN(nb[0]).mul(ONE_ETH);
        if (nb.length == 2)
            // For decimals, I have to pad the value with zeros to get the right value.
            output.iadd(toBN(nb[1].padEnd(18, '0')))
        return output;
    } catch(_) {
        return NaN;
    }
}