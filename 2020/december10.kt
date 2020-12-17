import java.io.File

/**
 * https://adventofcode.com/2020/day/10
 */
fun main() {
    println(star1()) // 1998
    println(star2()) // 347250213298688
}

private fun input(): List<String> {
    return File("2020/december10.txt").readLines();
}

private fun star1(): Int {
    val adapters = input().map(String::toLong).sorted()
    var prev = 0L
    var ones = 0
    var threes = 0
    for (curr in adapters) {
        if (curr - prev == 3L) {
            threes++
        } else if (curr - prev == 1L) {
            ones++
        }
        prev = curr
    }
    // your device's built-in adapter is always 3 higher than the highest adapter
    threes++

    //println("${ones} * ${threes}")
    return ones * threes
}

private fun star2(): Long {
    val adapters = input().map(String::toLong).sorted()
    var prev1 = 0L
    var prev1paths = 1L
    var prev2 = -99L
    var prev2paths = 1L
    var prev3 = -99L
    var prev3paths = 1L

    for (curr in adapters) {
        var pathsToCurr = 0L
        if (curr - prev1 <= 3L) {
            pathsToCurr += prev1paths
        }
        if (curr - prev2 <= 3L) {
            pathsToCurr += prev2paths
        }
        if (curr - prev3 <= 3L) {
            pathsToCurr += prev3paths
        }
        prev3 = prev2
        prev2 = prev1
        prev1 = curr
        prev3paths = prev2paths
        prev2paths = prev1paths
        prev1paths = pathsToCurr
    }
    return prev1paths
}




