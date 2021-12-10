export function argparse(args) {
    let keys = Object.keys(args)
    let query = ""

    for (let key of keys) {
        query += `${key}=${args[key]}&`
    }

    return query.slice(0, -1)
} 