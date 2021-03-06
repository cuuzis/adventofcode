import java.io.File

/**
 * https://adventofcode.com/2020/day/6
 */
fun main() {
    println(star1()) // 6391
    println(star2()) // 3042
}

private fun input(): List<String> {
    return File("2020/december06.txt").readLines();
}

private fun star1(): Int {
    var sum = 0;
    val yeses = mutableSetOf<Char>()
    for (line in input()) {
        for (c in line) {
            yeses.add(c);
        }
        if (line.length == 0) {
            sum += yeses.count();
            yeses.clear()
        }
    }
    return sum;
}

private fun star2(): Int {
    var sum = 0;
    var isFirst = true;
    val yeses = mutableSetOf<Char>()
    for (line in input()) {
        val yesesOfPerson = mutableSetOf<Char>()
        for (c in line) {
            yesesOfPerson.add(c);
        }

        if (line.length == 0) {
            sum += yeses.count();
            yeses.clear()
            isFirst = true;
        } else if (isFirst) {
            yeses.addAll(yesesOfPerson)
            isFirst = false;
        } else {
            yeses.retainAll(yesesOfPerson)
        }
    }
    return sum;
}




