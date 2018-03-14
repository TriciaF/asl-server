class _Node {
  constructor(value, next) {
    this.value=value,
    this.next=next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item){
    this.head = new _Node(item, this.head);
  }
  insertLast(item){
    if(this.head === null){
      this.insertFirst(item);
    }
    else{
      let tempNode = this.head;
      while(tempNode.next !== null){
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  find(item) { 
  //start at the head
    let currNode = this.head;
    //if the list is empty
    if (!this.head){
      return null;
    }
    //Check for the item 
    while(currNode.value !== item) {
      //return null if end of the list 
      // and the item is not on the list
      if (currNode.next === null) {
        return null;
      }
      else {
        //otherwise keep looking 
        currNode = currNode.next;
      }
    }
    //found it
    return currNode;
  }
  remove(item){ 
  //if the list is empty
    if (!this.head){
      return null;
    }
    //if the node to be removed is head, make the next node head
    if(this.head === item){
      this.head = this.head.next;
      return;
    }
    //start at the head
    let currNode = this.head;
    //keep track of previous
    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
      //save the previous node 
      previousNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null){
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }
  insertBefore(insertValue, findValue) {
    let newNode = new _Node(insertValue, null);
    let current = this.head;
    let previous = this.head;
    if (this.head === null)
      return;
    if (this.head.value === findValue) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    while ((current.value !== findValue) && (current.next !== null)) {
      previous = current;
      current = current.next;
    }
    newNode.next = current;
    previous.next = newNode;
  }
  insertAfter(insertValue, findValue) {
    let newNode = new _Node(insertValue, null);
    let current = this.head;
    let previous = this.head;
    if (this.head === null) {
      console.log("list is empty cannot insertAfter");
      return
    }
    if (this.head.value === findValue) {
      newNode.next = this.head.next;
      this.head.next = newNode;
      return
    }
    while ((current.value !== findValue) && (current.next !== null)) {
      previous = current;
      current = current.next
    }
    newNode.next = current.next;
    current.next = newNode;
  }
  insertAt(value, position) {
    let newNode = new _Node(value, null);
    let current = this.head;
    let prev = this.head;
    if (this.head === null) {
      console.log("list is empty cannot insertAfter");
      return
    }
    if (position === 0) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    let i = 0
    while (i !== position) {
      prev = current;
      current = current.next;
      i++
    }
    prev.next = newNode;
    newNode.next = current;
  }
}

module.exports = LinkedList;