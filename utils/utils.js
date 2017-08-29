import { randomColor } from 'randomcolor';

module.exports.randomHex = () => {
    return parseInt(randomColor().replace(/^#/, ''), 16);
};

module.exports.addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}