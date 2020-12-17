import scala.annotation.tailrec
import scala.io.Source

/**
 * https://adventofcode.com/2020/day/14
 *
 * functional programming tryout nightmare :)
 */
object december14 {

  def main(args: Array[String]) {
    val input = Source.fromFile("2020/december14.txt")
    try {
      val lines = input.getLines().toList
      println(star1(lines)) // 11179633149677
      println(star2(lines)) // 4822600194774
    } finally {
      input.close()
    }
  }

  private def intFromBinary(s: String): Long = {
    // s.foldLeft(0) => acc is an Int, which leads to overflow and wrong result
    s.foldLeft(0L)((acc, c) => if (c == '1') acc << 1 | 1 else acc << 1)
  }

  private def maskFunction(maskRow: String): Long => Long = {
    val mask = maskRow.substring("mask = ".length, maskRow.length)
    val onesMask = intFromBinary(mask.replace('X', '0'))
    val zeroesMask = intFromBinary(mask.replace('X', '1'))
    return (value: Long) => (value | onesMask) & zeroesMask : Long
  }

  // mask = (mask bits, bits that can be a '1')
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
    return (value: Long) => floatingMasks.map(mask => value & mask._2 | mask._1)
  }

  private def star1(input: List[String]): Long = {
    val lines = keepLastMemIdx(input)
    sumUp(lines)
  }


  private def sumUp(lines: List[String]): Long = {
    @tailrec
    def accumulate(lines: List[String], applyMask: Long => Long, result: Long): Long = {
      if (lines == Nil) {
        return result
      }
      if (lines.head.startsWith("mask")) {
        accumulate(lines.tail, maskFunction(lines.head), result)
      } else { // lines.head.startsWith("mem")
        val value = applyMask(lines.head.split(' ').last.toLong)
        accumulate(lines.tail, applyMask, result + value)
      }
    }
    accumulate(lines.tail, maskFunction(lines.head), 0L)
  }

  // remove duplicated "mem[]" writes that will be overwritten later
  private def keepLastMemIdx(lines: List[String]): List[String] = {
    @tailrec
    def accumulate(lines: List[String], result: List[String]): List[String] = {
      if (lines == Nil) {
        return result.reverse
      }
      if (lines.head.startsWith("mem") && result.exists(t => t.startsWith(lines.head.split(' ').head))) {
        accumulate(lines.tail, result)
      } else {
        accumulate(lines.tail, result.appended(lines.head))
      }
    }
    accumulate(lines.reverse, List())
  }

  private def star2(input: List[String]): Long = {
    sumAddresses(input)
  }

  private def sumAddresses(lines: List[String]): Long = {
    @tailrec
    def accumulate(lines: List[String], applyMask: Long => List[Long], result: Map[Long, Long]): Long = {
      if (lines == Nil) {
        return result.values.sum // reduce to sum
      }
      if (lines.head.startsWith("mask")) {
        accumulate(lines.tail, maskFunction2(lines.head), result)
      } else { // lines.head.startsWith("mem")
        val mem = lines.head.substring("mem[".length, lines.head.indexOf(']')).toLong
        val value = lines.head.split(' ').last.toLong
        val memLocations = applyMask(mem)
        val res = loopLocations(memLocations, result, value)
        accumulate(lines.tail, applyMask, res)
      }
    }
    accumulate(lines.tail, maskFunction2(lines.head), Map())
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


