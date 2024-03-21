const { analyseCookies } = require("../cookie-analyser")
const path = require("path");


test('no cookies for specified day returns empty', () => {
    console.log = jest.fn();
    
    analyseCookies(path.join(__dirname, "single_output_cookie_log.csv"), "2024-03-15");

    expect(console.log).not.toHaveBeenCalled();
});



test('stand out cookie for day returns single output', () => {
    console.log = jest.fn();
    
    analyseCookies(path.join(__dirname, "single_output_cookie_log.csv"), "2018-12-09");

    expect(console.log.mock.calls[0][0]).toBe('AtY0laUfhglK3lC7');
});



test('stand out cookie for day returns single output', () => {
    console.log = jest.fn();
    
    analyseCookies(path.join(__dirname, "double_output_cookie_log.csv"), "2018-12-09");

    expect(console.log.mock.calls[0][0]).toBe('AtY0laUfhglK3lC7\nSAZuXPGUrfbcn5UA');
});



test('no existent file returns 127', () => {
    console.error = jest.fn();
    process.exit = jest.fn();
    
    analyseCookies(path.join(__dirname, "fake_file.csv"), "2018-12-09");

    expect(process.exit.mock.calls[0][0]).toBe(127);
});