package solutions2020

import scala.annotation.tailrec
import scala.io.Source

object december15 {
  private val input = Array(2,20,0,4,1,17)

  def main(args: Array[String]) {
    println(time(star1()))
    println(time(star2()))
  }

  private def star1(): Any = star(2020)
  private def star2(): Any = star(30000000)

  private def star(finalTurn: Int): Any = {
    @tailrec
    def loopUntilFinalTurn(lastMentions: Map[Int, Int], num: Int, turn: Int): Int = {
      if (turn == finalTurn) return num
      val lastSpoken = lastMentions.get(num)
      if (lastSpoken.isEmpty) return loopUntilFinalTurn(lastMentions + (num -> turn), 0, turn + 1)
      else return loopUntilFinalTurn(lastMentions + (num -> turn), turn - lastSpoken.get, turn + 1)
    }

    // create a map of (number => last mention of number)
    val lastMentions = input.dropRight(1).zipWithIndex.map(it => (it._1, it._2 + 1)).toMap

    val startNum = input.last
    val startTurn = input.length
    return loopUntilFinalTurn(lastMentions, startNum, startTurn)
  }


  // util function for logging time
  private def time(f: => Any): Any = {
    val t0 = System.nanoTime()
    val result = f
    val t1 = System.nanoTime()
    println("Elapsed time: " + (t1 - t0) / 1000 / 1000 + "ms")
    result
  }

}
