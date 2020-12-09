package solutions2020

import java.io.File

fun main() {
    val weakNumber = star1()
    println(weakNumber)
    println(star2(weakNumber))
}

private fun input(): List<String> {
    return File("src/solutions2020/december09.txt").readLines();
}


private val preambleSize = 25

private fun star1(): Long {
    val lines = input().map(String::toLong)
    for (lineNum in preambleSize until lines.size) {
        val num = lines[lineNum]
        var isWeak = true
        for (i in lineNum - preambleSize until lineNum) {
            val num1 = lines[i]
            for (j in i + 1 until lineNum) {
                val num2 = lines[j];
                if (num1 + num2 == num) {
                    isWeak = false
                }
            }
        }
        if (isWeak) {
            return num
        }
    }
    return -1L
}

private fun star2(weakNumber: Long): Long {
    val lines = input().map(String::toLong)
    var start = 0
    var end = 1
    var sum = lines[0] + lines[1]
    while (start < end && end < lines.size) {
        if (sum < weakNumber) {
            // increase window
            end++
            sum += lines[end]
        } else if (sum > weakNumber) {
            // decrease window
            sum -= lines[start]
            start++
        } else if (sum == weakNumber) {
            // find min + max within window
            var min = lines[start]
            var max = lines[start]
            for (i in start..end) {
                if (lines[i] > max) {
                    max = lines[i]
                } else if (lines[i] < min) {
                    min = lines[i]
                }
            }
            return min + max
        }
    }
    return -1L
}




