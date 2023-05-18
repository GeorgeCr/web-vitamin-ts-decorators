import "reflect-metadata";

function Readonly(writable: boolean) {
  return function (target: any, memberName: string) {
    console.log(target, memberName)

    Object.defineProperty(target, memberName, {
      writable: !writable,
    })
  }
}

function withAuth(isAuth: boolean) {
  return function (target: any, memberName: string) {

  }
}

function Controller(path: string, obj: any) {
  return function (target: Function) {
    target.prototype.path = path
    target.prototype.id = obj.data.id;
    target.prototype.sum = obj.data.sum;
  }
}

function Get(path: string) {
  return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    // console.log("the path is", path);
    console.log(target, propertyKey, propertyDescriptor);

    const actualFunction = function(path: string) {
      console.log("really injecting path at runtime now", path);
    }

    propertyDescriptor.value = actualFunction;

    return actualFunction.call(target, path);
  }
}

// app.get("/users", (req, res) => {
//   fetchUsers(req, res);
// })

@Controller('/users', { data: { id: 123, sum: 900 }})
class UserController {
  path: string
  id: number;
  sum: number;

  @Get("/")
  fetchUsers(path?: string) {
    console.log("getting path at runtime from decorator", path)
  }

  @withAuth(true)
  @Readonly(false)
  userService: any

  @Readonly(false)
  dbService: any

  mutateUserService() {
    this.userService = null
    // console.log(this.userService)
  }

  mutateDbService() {
    this.dbService = null
  }
}

const ctrl = new UserController()
ctrl.fetchUsers();
console.log('this is the injected path', ctrl.path, ctrl.id, ctrl.sum)
ctrl.mutateUserService()

ctrl.mutateDbService()

function Component({ template }: { template: string }) {
  return function (target: Function) {
    target.prototype.template = template;
  }
}

function ComponentWithReflect({ templateWithReflect }: { templateWithReflect: string }) {
  return function (target: Function) {
    Reflect.defineMetadata("templateWithReflect", templateWithReflect, target.prototype);
  }
}
@Component({
  template: '<div>Hello</div>',
})
@ComponentWithReflect({
  templateWithReflect: '<div>Hello from reflect</div>'
})
class UsersComponent {
  template: string;
}

const usersCmp = new UsersComponent();

console.log("template", usersCmp.template, Reflect.getMetadata("templateWithReflect", usersCmp));
