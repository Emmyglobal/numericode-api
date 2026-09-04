// ─── Python Course — Module 5: Object-Oriented Python ───────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P5.1 — Classes & Objects',
  duration: 10,
  content: `# P5.1 — Classes & Objects

A class is a blueprint; an object (instance) is one concrete thing built from it.

## Learning Objectives
- Define a class with __init__ and instance attributes.
- Create multiple independent instances.
- Explain the difference between a class and an object.

## Introduction
Instead of juggling parallel lists (names here, scores there), a class bundles related data and behavior into one unit. Student is the blueprint; ada and bob are objects built from it.

## Defining a Class
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

s1 = Student("ada", 82)
s2 = Student("bob", 91)
print(s1.name, s1.score)   # ada 82
print(s2.name, s2.score)   # bob 91

## __init__ and self
__init__ runs when you create an instance. self is the instance being built — attach attributes with self.x = ...

## Worked Example — Point Class
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 5)
q = Point(0, 0)
print(p.x, p.y)   # 3 5
print(q.x, q.y)   # 0 0
p.x = 10
print(p.x, q.x)   # 10 0  (independent)

## Practical Exercise
Run this:
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

b1 = Book("Python 101", 300)
b2 = Book("Data Tales", 220)
print(b1.title, b1.pages)
print(b2.title, b2.pages)
Tasks: (1) what prints; (2) create a third book and print it. Check: Python 101 300 / Data Tales 220; the third book prints its own values.
Expected scaffold lines (copy exactly):
    class Book:
        def __init__(self, title, pages):
            self.title = title
            self.pages = pages
    b1 = Book("Python 101", 300)
    b2 = Book("Data Tales", 220)
    print(b1.title, b1.pages)
    print(b2.title, b2.pages)

## Key Takeaways
- class Name: defines a blueprint; Name(args) builds an instance.
- __init__ initializes attributes; self refers to the current instance.
- Each instance has its own attribute values — changing one does not affect others.
- Classes bundle data (attributes) with behavior (methods) — next lesson.

## Quiz Answer Key
1. (b) An object is one concrete instance built from a class blueprint.
2. (a) __init__ runs automatically when an instance is created.
3. False — each instance has independent attribute values.
4. (c) self.name = name stores the name on the instance.
5. (b) Student("ada", 82) creates one Student instance.
`,
  quiz: {
    title: 'Quiz P5.1 — Classes & Objects',
    description: '5 auto-gradable questions on classes, instances, and __init__.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'An object is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A blueprint', isCorrect: false }, { id: 'b', text: 'An instance built from a class', isCorrect: true }, { id: 'c', text: 'A module', isCorrect: false }, { id: 'd', text: 'A loop', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'When does __init__ run?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'When an instance is created', isCorrect: true }, { id: 'b', text: 'On every method call', isCorrect: false }, { id: 'c', text: 'At program exit', isCorrect: false }, { id: 'd', text: 'Never', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Changing s1.name also changes s2.name.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Inside __init__, ______ refers to the instance being built.', questionType: 'fill_blank', correctAnswer: 'self' },
      { id: 'q5', questionText: 'Student("ada", 82) does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Defines the class', isCorrect: false }, { id: 'b', text: 'Creates a Student instance', isCorrect: true }, { id: 'c', text: 'Deletes a student', isCorrect: false }, { id: 'd', text: 'Prints', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P5.1 — Model a Class',
    description: 'Design a Product class with name and price attributes; create three products and print each. Good: correct __init__, three instances, clean output; rubric: 6 class, 5 instances, 5 output, 4 explanation = 20.',
    dueDate: '2026-07-26T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write class Product with __init__(self, name, price); create three instances; print each product name and price.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why bundle data in a class instead of parallel lists?', marks: 8 }],
  },
})

lessons.push({
  title: 'P5.2 — Methods & self',
  duration: 8,
  content: `# P5.2 — Methods & self

A method is a function defined inside a class; it reads and updates the instance through self.

## Learning Objectives
- Add methods that read instance attributes.
- Add methods that update state.
- Chain a method call on an instance (obj.method()).

## Introduction
Methods give objects behavior. student.average() reads this student's scores; account.deposit(50) updates this account's balance. self is how the method knows which instance it belongs to.

## Reading Methods
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def average(self):
        return sum(self.scores) / len(self.scores)

s = Student("ada", [82, 91, 77])
print(s.average())   # 83.33...

## Updating Methods
class Counter:
    def __init__(self):
        self.count = 0

    def bump(self):
        self.count = self.count + 1

c = Counter()
c.bump()
c.bump()
print(c.count)   # 2

## Worked Example — Bank Account
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance = self.balance + amount
        return self.balance

    def summary(self):
        return f"{self.owner}: {self.balance}"

a = Account("ada")
a.deposit(100)
a.deposit(50)
print(a.summary())   # ada: 150

## Practical Exercise
Run this:
class Timer:
    def __init__(self):
        self.seconds = 0

    def tick(self):
        self.seconds = self.seconds + 1

t = Timer()
t.tick()
t.tick()
t.tick()
print(t.seconds)
Tasks: (1) what prints; (2) add a reset method that sets seconds back to 0 and call it. Check: 3; after reset, 0.
Expected scaffold lines (copy exactly):
    class Timer:
        def __init__(self):
            self.seconds = 0
        def tick(self):
            self.seconds = self.seconds + 1
    t = Timer()
    t.tick()
    t.tick()
    t.tick()
    print(t.seconds)

## Key Takeaways
- Methods are functions inside a class; the first parameter is always self.
- self.attribute reads state; self.attribute = ... updates it.
- Call methods with instance.method(args) — Python fills in self automatically.
- Methods that only read are called getters; those that update are setters/mutators.

## Quiz Answer Key
1. (a) self is the instance the method was called on.
2. (b) s.average() calls the average method on instance s.
3. False — methods can update state (e.g., deposit changes balance).
4. (c) self.balance = self.balance + amount updates the instance balance.
5. (b) 2 — bump was called twice.
`,
  quiz: {
    title: 'Quiz P5.2 — Methods & self',
    description: '5 auto-gradable questions on methods, self, and state updates.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Inside a method, self refers to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The instance the method was called on', isCorrect: true }, { id: 'b', text: 'The class itself', isCorrect: false }, { id: 'c', text: 'A global variable', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 's.average() does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Defines a method', isCorrect: false }, { id: 'b', text: 'Calls the average method on s', isCorrect: true }, { id: 'c', text: 'Deletes s', isCorrect: false }, { id: 'd', text: 'Prints the class', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: Methods can update an instance state.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: In deposit, ______.balance = ______.balance + amount updates the instance.', questionType: 'fill_blank', correctAnswer: 'self' },
      { id: 'q5', questionText: 'After two bump() calls on a fresh Counter, count is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '0', isCorrect: false }, { id: 'b', text: '2', isCorrect: true }, { id: 'c', text: '1', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P5.2 — Design Methods',
    description: 'Extend the Account class with a withdraw method (blocks negative balances) and a history list of transactions. Good: correct withdraw guard, correct history; rubric: 6 withdraw, 5 guard, 5 history, 4 explanation = 20.',
    dueDate: '2026-07-27T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Add withdraw(amount) that refuses to go below 0 (prints a warning instead), and record every deposit/withdraw in self.history. Show the class and a demo.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why should withdraw return or signal failure rather than silently going negative?', marks: 8 }],
  },
})

lessons.push({
  title: 'P5.3 — Inheritance',
  duration: 8,
  content: `# P5.3 — Inheritance

A subclass inherits attributes and methods from a parent class, then adds or overrides what it needs.

## Learning Objectives
- Define a subclass that extends a parent class.
- Call the parent initializer with super().__init__().
- Override a method to change behavior for the subclass.

## Introduction
When two classes share most of their behavior, inheritance removes the duplication. Animal defines name and speak; Dog and Cat extend it, each with its own speak. The subclass gets everything the parent has for free.

## Basic Inheritance
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):          # override
        return "Woof"

d = Dog("rex")
print(d.name)     # rex   (inherited)
print(d.speak())  # Woof  (overridden)

## super().__init__
class Cat(Animal):
    def __init__(self, name, indoor):
        super().__init__(name)     # run the parent init
        self.indoor = indoor       # add a new attribute

c = Cat("milo", True)
print(c.name, c.indoor)   # milo True

## Worked Example — Shapes
class Shape:
    def __init__(self, name):
        self.name = name
    def area(self):
        return 0

class Square(Shape):
    def __init__(self, side):
        super().__init__("square")
        self.side = side
    def area(self):
        return self.side ** 2

s = Square(4)
print(s.name, s.area())   # square 16

## Practical Exercise
Run this:
class Vehicle:
    def __init__(self, wheels):
        self.wheels = wheels

class Bike(Vehicle):
    def __init__(self):
        super().__init__(2)

b = Bike()
print(b.wheels)
Tasks: (1) what prints; (2) add a Car subclass with 4 wheels and print its wheels. Check: 2; Car prints 4.
Expected scaffold lines (copy exactly):
    class Vehicle:
        def __init__(self, wheels):
            self.wheels = wheels
    class Bike(Vehicle):
        def __init__(self):
            super().__init__(2)
    b = Bike()
    print(b.wheels)

## Key Takeaways
- class Child(Parent): makes Child inherit everything from Parent.
- Override a method by redefining it in the subclass.
- super().__init__(...) runs the parent initializer before adding subclass state.
- Inheritance models is-a relationships; avoid it just to share one function.

## Quiz Answer Key
1. (b) class Dog(Animal) makes Dog a subclass of Animal.
2. (a) super().__init__(name) runs the parent class initializer.
3. False — overriding replaces the parent behavior for that subclass.
4. (c) d.name comes from Animal; d.speak() comes from Dog's override.
5. (b) A Cat is-a Animal — the classic is-a relationship.
`,
  quiz: {
    title: 'Quiz P5.3 — Inheritance',
    description: '5 auto-gradable questions on subclasses, super(), and overriding.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'class Dog(Animal) means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Animal inherits from Dog', isCorrect: false }, { id: 'b', text: 'Dog inherits from Animal', isCorrect: true }, { id: 'c', text: 'Dog equals Animal', isCorrect: false }, { id: 'd', text: 'Syntax error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'super().__init__(name) does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Runs the parent initializer', isCorrect: true }, { id: 'b', text: 'Creates a new class', isCorrect: false }, { id: 'c', text: 'Deletes self', isCorrect: false }, { id: 'd', text: 'Prints name', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A subclass must keep the parent method implementation unchanged.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Redefining speak() in Dog is called ______ the method.', questionType: 'fill_blank', correctAnswer: 'overriding' },
      { id: 'q5', questionText: 'Which pair best fits inheritance?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Car and Engine', isCorrect: false }, { id: 'b', text: 'Cat and Animal', isCorrect: true }, { id: 'c', text: 'List and dict', isCorrect: false }, { id: 'd', text: 'int and str', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P5.3 — Extend a Class',
    description: 'Create a Shape parent with area(), then Square and Circle subclasses that override area(). Good: correct parent, correct super() use, correct formulas; rubric: 5 parent, 5 square, 5 circle, 5 super = 20.',
    dueDate: '2026-07-28T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write Shape (name, area() -> 0), Square(side) with area = side**2, Circle(radius) with area = pi*r**2 using super().__init__. Show code and outputs for Square(4) and Circle(3).', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Give one sign that inheritance is the wrong tool for two classes.', marks: 8 }],
  },
})

lessons.push({
  title: 'P5.4 — Polymorphism & Dunder Methods',
  duration: 8,
  content: `# P5.4 — Polymorphism & Dunder Methods

Polymorphism means one call, many behaviors. Dunder methods (__str__, __len__, __eq__) let your classes plug into Python's built-ins.

## Learning Objectives
- Call the same method on different subclasses and get subclass behavior.
- Add __str__ so print() shows a readable description.
- Implement __len__ and __eq__ to integrate with len() and ==.

## Introduction
When Dog and Cat both define speak(), a loop over animals can call speak() without caring which is which — that is polymorphism. Dunder (double-underscore) methods are hooks Python calls automatically.

## Polymorphism in a Loop
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"

for a in [Dog(), Cat(), Animal()]:
    print(a.speak())    # Woof, Meow, ...

## __str__ — Readable Printing
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

print(Point(3, 5))   # Point(3, 5)

## __len__ and __eq__
class Basket:
    def __init__(self, items):
        self.items = items
    def __len__(self):
        return len(self.items)
    def __eq__(self, other):
        return self.items == other.items

b = Basket([1, 2])
print(len(b))                    # 2
print(b == Basket([1, 2]))       # True

## Practical Exercise
Run this:
class Word:
    def __init__(self, text):
        self.text = text
    def __str__(self):
        return self.text.upper()
    def __len__(self):
        return len(self.text)

w = Word("hello")
print(str(w))
print(len(w))
Tasks: (1) what prints; (2) add __eq__ comparing .text and test two Words. Check: HELLO then 5; equal words compare True.
Expected scaffold lines (copy exactly):
    class Word:
        def __init__(self, text):
            self.text = text
        def __str__(self):
            return self.text.upper()
        def __len__(self):
            return len(self.text)
    w = Word("hello")
    print(str(w))
    print(len(w))

## Key Takeaways
- Polymorphism: the same method call runs different code per subclass.
- __str__ controls what print() shows; return a readable string.
- __len__ plugs into len(); __eq__ into ==; __repr__ into the debugger.
- Dunders are hooks — implement the ones your class needs, no more.

## Quiz Answer Key
1. (b) Polymorphism is one call, many behaviors depending on the instance type.
2. (a) __str__ returns the string print() displays.
3. False — __len__ should return an integer (the length).
4. (b) len(b) calls Basket.__len__.
5. (c) Woof, Meow, ... — each object uses its own speak.
`,
  quiz: {
    title: 'Quiz P5.4 — Polymorphism & Dunders',
    description: '5 auto-gradable questions on polymorphism and dunder methods.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Polymorphism means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Many classes, one instance', isCorrect: false }, { id: 'b', text: 'One call, many behaviors', isCorrect: true }, { id: 'c', text: 'One parent only', isCorrect: false }, { id: 'd', text: 'No methods', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '__str__ controls:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'What print() shows', isCorrect: true }, { id: 'b', text: 'The class name', isCorrect: false }, { id: 'c', text: 'Memory size', isCorrect: false }, { id: 'd', text: 'Imports', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: __len__ must return a string.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: len(b) calls b.______().', questionType: 'fill_blank', correctAnswer: '__len__' },
      { id: 'q5', questionText: 'Looping [Dog(), Cat(), Animal()] calling speak() prints:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Three Woofs', isCorrect: false }, { id: 'b', text: 'Three Meows', isCorrect: false }, { id: 'c', text: 'Woof, Meow, ...', isCorrect: true }, { id: 'd', text: 'Error', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment P5.4 — Polymorphic Report',
    description: 'Build Animal subclasses (Dog, Cat, Bird) with distinct speak() and a zoo loop that polymorphically reports each. Good: three subclasses, correct loop, clean output; rubric: 6 subclasses, 5 loop, 5 output, 4 explanation = 20.',
    dueDate: '2026-07-29T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write Animal with speak(); Dog/Cat/Bird override it; loop over a list of mixed animals printing name + sound. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What makes __str__ more useful than a custom describe() method?', marks: 8 }],
  },
})

lessons.push({
  title: 'P5.5 — Mini Project: A Bank Account Class',
  duration: 12,
  content: `# P5.5 — Mini Project: A Bank Account Class

Combine attributes, methods, and state guards into one small working class.

## Learning Objectives
- Design a class with attributes, methods, and a validation rule.
- Test the class with a realistic sequence of operations.
- Explain each design decision in one sentence.

## Introduction
Everything from Module 5 comes together here: __init__ for state, methods for behavior, and a business rule (no overdrafts) enforced inside a method. This is the shape of almost every class you will write.

## The Full Class
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            return False
        self.balance += amount
        self.history.append(("deposit", amount))
        return True

    def withdraw(self, amount):
        if amount <= 0 or amount > self.balance:
            return False
        self.balance -= amount
        self.history.append(("withdraw", amount))
        return True

    def __str__(self):
        return f"{self.owner}: balance={self.balance}"

## Using It
a = BankAccount("ada")
a.deposit(100)
a.deposit(50)
print(a.withdraw(200))   # False (insufficient funds)
print(a.withdraw(80))    # True
print(a)                 # ada: balance=70
print(a.history)

## Practical Exercise
Run this:
class Wallet:
    def __init__(self):
        self.cash = 0

    def add(self, amount):
        if amount > 0:
            self.cash += amount
            return True
        return False

w = Wallet()
print(w.add(20))
print(w.add(-5))
print(w.cash)
Tasks: (1) what prints; (2) add a spend(amount) method with the same guard and test it. Check: True, False, 20; spend(10) then cash is 10.
Expected scaffold lines (copy exactly):
    class Wallet:
        def __init__(self):
            self.cash = 0
        def add(self, amount):
            if amount > 0:
                self.cash += amount
                return True
            return False
    w = Wallet()
    print(w.add(20))
    print(w.add(-5))
    print(w.cash)

## Key Takeaways
- Validate inside methods — never trust the caller to pass good values.
- Returning True/False (or raising) makes outcomes testable.
- A history list gives you an audit trail almost for free.
- __str__ makes the object report itself; print(a) tells the whole story.

## Quiz Answer Key
1. (b) The guard amount > self.balance blocks overdrafts inside withdraw.
2. (a) Validation belongs inside the method that changes state.
3. False — history records only successful transactions.
4. (c) __str__ returns the string print() displays.
5. (b) 70 — 100 + 50 - 80.
`,
  quiz: {
    title: 'Quiz P5.5 — Bank Account Mini Project',
    description: '5 auto-gradable questions on the bank account class design.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Why check amount > self.balance inside withdraw?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'To run faster', isCorrect: false }, { id: 'b', text: 'To block overdrafts', isCorrect: true }, { id: 'c', text: 'To sort history', isCorrect: false }, { id: 'd', text: 'No reason', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Where should the overdraft rule live?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Inside the withdraw method', isCorrect: true }, { id: 'b', text: 'In the caller', isCorrect: false }, { id: 'c', text: 'In __str__', isCorrect: false }, { id: 'd', text: 'Nowhere', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A failed deposit still appears in history.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ makes print(a) show a readable balance summary.', questionType: 'fill_blank', correctAnswer: '__str__' },
      { id: 'q5', questionText: 'After deposit(100), deposit(50), withdraw(80), the balance is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '150', isCorrect: false }, { id: 'b', text: '70', isCorrect: true }, { id: 'c', text: '230', isCorrect: false }, { id: 'd', text: '80', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P5.5 — Extend the Bank',
    description: 'Add transfer(other, amount) to BankAccount, moving money between two accounts with full validation, and test all failure paths. Good: correct transfer logic, both guards, clean tests; rubric: 8 transfer, 4 guards, 4 tests, 4 explanation = 20.',
    dueDate: '2026-07-30T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement transfer(self, other, amount) that validates amount and funds, moves the money, records history on both accounts, and returns True/False. Demo two accounts.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'List two failure paths your transfer must handle before moving money.', marks: 8 }],
  },
})

export const module05: ModuleData = {
  title: 'Module 5 — Object-Oriented Python',
  lessons,
}
