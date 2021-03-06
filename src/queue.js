class Queue{
    constructor(){
        this.start = undefined;
        this.end = undefined;
        this.len = 0;
    }

    enqueue(data){
        const node = new Node(data);
        if(this.start === undefined){
            this.start = node;
            this.end = node;
        }
        else{
            this.end.next = node;
            this.end = node;
        }
        this.len = this.len + 1;
        // this.display();
    }

    dequeue(){
        // this.display();
        if(this.start === undefined){
            return('Queue Empty');
        }
        else if(this.start === this.end){
            const node = this.start;
            this.start = undefined;
            this.end = undefined;
            this.len = this.len - 1;
            return node;
        }
        else{
            const node = this.start;
            this.start = this.start.next;
            this.len = this.len - 1;
            return node;
        }
    }

    remove(data){
        if(data === this.start.data){
            this.start = this.start.next;
            this.len = this.len-1;
        }
        else{
            let node = this.start;
            while(node.next!=undefined){
                if(node.next.data === data){
                    node.next = node.next.next;
                    this.len = this.len-1;
                    break;
                }
                node = node.next;
            }
        }
    }

    display(){
        let node = this.start;
        while(node !== undefined){
            console.log(node.data);
            node = node.next;
        }
    }

}

class Node{
    constructor(data){
        this.data = data;
        this.next = undefined;
    }
}

module.exports = Queue;

