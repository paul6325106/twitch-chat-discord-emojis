const COLOURS = [
    'Blue',
    'Coral',
    'DodgerBlue',
    'SpringGreen',
    'YellowGreen',
    'Green',
    'OrangeRed',
    'Red',
    'GoldenRod',
    'HotPink',
    'CadetBlue',
    'SeaGreen',
    'Chocolate',
    'BlueViolet',
    'Firebrick',
];

function charCode(char: string): number {
    return char.charCodeAt(0);
}

function sum(total: number, num: number): number {
    return total + num;
}

export default function getRandomColour(displayName: string): string {
    const magic = displayName.split('').map(charCode).reduce(sum);
    return COLOURS[magic % COLOURS.length];
}
