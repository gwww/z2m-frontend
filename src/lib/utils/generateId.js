let n = Date.now();

export default function(prefix = 'tx-') {
    return prefix + (++n).toString(36);
}
