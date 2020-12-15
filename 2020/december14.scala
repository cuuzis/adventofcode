package solutions2020

import scala.annotation.tailrec
import scala.io.Source

/**
 * functional programming tryout nightmare :)
 */
object december14 {

  def main(args: Array[String]) {
    val input = Source.fromFile("src/solutions2020/december14.txt")
    try {
      val lines = input.getLines().toList
      println(star1(lines))
      println(star2(lines))
    } finally {
      input.close()
    }
  }

  private def intFromBinary(s: String): Long = {
    // s.foldLeft(0) => acc is Int and leads to wrong result
    s.foldLeft(0L)((acc, c) => if (c == '1') acc << 1 | 1 else acc << 1)
  }

  private def maskFunction(maskRow: String): Long => Long = {
    val mask = maskRow.substring("mask = ".length, maskRow.length)
    val onesMask = intFromBinary(mask.replace('X', '0'))
    val zeroesMask = intFromBinary(mask.replace('X', '1'))
    return (value: Long) => (value | onesMask) & zeroesMask : Long
  }

//  def getFloatingMasks(charsLeft: String, mask: String, masks: List[Long]): List[Long] = {
//    if (charsLeft.isEmpty) {
//      return masks.appended(intFromBinary(mask))
//    }
//    val c = charsLeft.head
//    if (c == '1' || c == '0') return getFloatingMasks(charsLeft.tail, mask + c, masks)
//    // if (c == 'X')
//    return getFloatingMasks(charsLeft.tail, mask + '1', masks) ++ getFloatingMasks(charsLeft.tail, mask + '0', masks)
//  }

  // mask == (mask, canBeOne)
  def getFloatingMasks(charsLeft: String, mask: (String, String), masks: List[(Long, Long)]): List[(Long, Long)] = {
    if (charsLeft.isEmpty) {
      return masks.appended((intFromBinary(mask._1), intFromBinary(mask._2)))
    }
    val c = charsLeft.head
    if (c == '1' || c == '0') return getFloatingMasks(charsLeft.tail, (mask._1 + c, mask._2 + '1'), masks)
    // if (c == 'X')
    return getFloatingMasks(charsLeft.tail, (mask._1 + '1', mask._2 + '1'), masks) ++
      getFloatingMasks(charsLeft.tail, (mask._1 + '0', mask._2 + '0'), masks)
  }

  private def maskFunction2(maskRow: String): Long => List[Long] = {
    val mask = maskRow.substring("mask = ".length, maskRow.length)
    val floatingMasks = getFloatingMasks(mask, ("", ""), List())
//    floatingMasks.map(it => (it._1, it._1.toBinaryString, it._2.toBinaryString))
//      .foreach(println)
//    println
    return (value: Long) => floatingMasks.map(mask => {
//      println("mask:   " + mask._1)
//      println("value:  " + value)
//      println("bmask:  " + mask._1.toBinaryString)
//      println("bvalue: " + value.toBinaryString)
//      println("zeroes: " + mask._2.toBinaryString)
//      println("result: " + (value | mask._1 & mask._2).toBinaryString)
//      println("result: " + (value & mask._2 | mask._1 ))
//      println
      value & mask._2 | mask._1
    })
  }

//  private def maskFunction(maskRow: String): Long => Long = {
//    val onesMask = intFromBinary(maskRow.substring("mask = ".length, maskRow.length).replace('X', '0'))
//    val zeroesMask = intFromBinary(maskRow.substring("mask = ".length, maskRow.length).replace('X', '1'))
//    return (value: Long) => (value | onesMask) & zeroesMask : Long
//  }

//  private def splitLine(line: String): Array[Long] =
//    line
//      .substring("mem[".length, line.length)
//      .split("] = ")
//      .map(s => s.toLong)

//  private def lineTuples(lines: List[String]): List[(Long, Long)] =
//    lines
//      .map(splitLine)
//      .map(ints => (ints.head, ints.tail.head))
//
//  private def memorySum(tuples: List[(Long, Long)], applyMask: Long => Long): Long =
//    //keepLastUniqueIdx(tuples)
//    tuples
//      .map(t => applyMask(t._2))
//      .sum

//  private def star1(input: List[String]): Long = {
//    val applyMask = maskFunction(input.head)
//    val lines = lineTuples(keepLastMemIdx(input.tail))
//    memorySum(lines, applyMask)
//  }

  private def star1(input: List[String]): Long = {
    val lines = keepLastMemIdx(input)
    //println()
    //println("Lines kept:")
//    println(lines.filterNot(l => l.startsWith("mask")).size)
    sumUp(lines)
  }


  private def sumUp(lines: List[String]): Long = {
    @tailrec
    def maxAccum(lines: List[String], applyMask: Long => Long, result: Long): Long = {
      if (lines == Nil) {
        return result
      }
      if (lines.head.startsWith("mask")) {
        maxAccum(lines.tail, maskFunction(lines.head), result)
      } else { // lines.head.startsWith("mem")
        val value = applyMask(lines.head.split(' ').last.toLong)
        maxAccum(lines.tail, applyMask, result + value)
      }
    }
    maxAccum(lines.tail, maskFunction(lines.head), 0L)
  }


  private def keepLastMemIdx(lines: List[String]): List[String] = {
    @tailrec
    def accumulate(lines: List[String], result: List[String]): List[String] = {
      if (lines == Nil) {
        return result.reverse
      }
      if (lines.head.startsWith("mem") && result.exists(t => t.startsWith(lines.head.split(' ').head))) {
//        println(lines.head)
//        println(result.find(t => t.startsWith(lines.head.split(' ').head)))
        accumulate(lines.tail, result)
      } else {
        accumulate(lines.tail, result.appended(lines.head))
      }
    }
    //println(lines)
    accumulate(lines.reverse, List())
  }

//  private def keepLastUniqueIdx(tuples: List[(Long, Long)]): List[(Long, Long)] = {
//    @tailrec
//    def accumulate(tuples: List[(Long, Long)], result: List[(Long, Long)]): List[(Long, Long)] = {
//      if (tuples == Nil) {
//        return result
//      }
//      if (result.exists(t => t._1 == tuples.head._1)) {
//        accumulate(tuples.tail, result)
//      } else {
//        accumulate(tuples.tail, result.appended(tuples.head))
//      }
//    }
//    accumulate(tuples.reverse, List())
//  }


//  def lineMax(lines: List[(Long, Long)]): Long =
//    max(lines.map(t => t._2))
//
//  def max(ints: List[Long]): Long = {
//    @tailrec
//    def maxAccum(ints: List[Long], theMax: Long): Long = {
//      ints match {
//        case Nil => theMax
//        case x :: tail =>
//          val newMax = if (x > theMax) x else theMax
//          maxAccum(tail, newMax)
//      }
//    }
//    maxAccum(ints, 0)
//  }
//
//  def fib(n: Long): Long = {
//    @tailrec
//    def loop(n: Long, prev: Long, cur: Long): Long =
//      if (n <= 0) prev
//      else loop(n - 1, cur, prev + cur)
//    loop(n, 0, 1)
//  }




  private def star2(input: List[String]): Long = {
    sumAddresses(input)
  }

  private def sumAddresses(lines: List[String]): Long = {
    @tailrec
    def maxAccum(lines: List[String], applyMask: Long => List[Long], result: Map[Long, Long]): Long = {
      if (lines == Nil) {
        return result.values.sum // reduce to sum
      }
      if (lines.head.startsWith("mask")) {
        maxAccum(lines.tail, maskFunction2(lines.head), result)
      } else { // lines.head.startsWith("mem")
        val mem = lines.head.substring("mem[".length, lines.head.indexOf(']')).toLong
        val value = lines.head.split(' ').last.toLong
        val memLocations = applyMask(mem)
        val res = loopLocations(memLocations, result, value)
        maxAccum(lines.tail, applyMask, res)
      }
    }
    maxAccum(lines.tail, maskFunction2(lines.head), Map())
  }


  def loopLocations(memLocations: List[Long], result: Map[Long, Long], value: Long): Map[Long, Long] = {
    @tailrec
    def loop(memLocations: List[Long], result: Map[Long, Long]): Map[Long, Long] = {
      if (memLocations == Nil) {
        return result
      }
      loop(memLocations.tail, result + (memLocations.head -> value))
    }
    loop(memLocations, result)
  }
}


