setup() {
    load 'test_helper/bats-support/load'
    load 'test_helper/bats-assert/load'
}

@test "can run the script" {
    touch foo.csv
    ./cookie-analyser -f foo.csv -d 2024-03-15
    rm foo.csv
}

@test "no cookies for specified day returns empty" {
    output=$(./cookie-analyser -f tests/single_output_cookie_log.csv -d 2024-03-15)
    assert_output ""
}

@test "stand out cookie for day returns single output" {
    output=$(./cookie-analyser -f tests/single_output_cookie_log.csv -d 2018-12-09)
    assert_output "AtY0laUfhglK3lC7"
}

@test "two equal cookies for day returns two outputs" {
    output=$(./cookie-analyser -f tests/double_output_cookie_log.csv -d 2018-12-09)
    assert_output "SAZuXPGUrfbcn5UA
AtY0laUfhglK3lC7"
}