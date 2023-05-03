import "reflect-metadata";

function Readonly(writable: boolean) {
  return function (target: any, memberName: string) {
    console.log(target, memberName)

    Object.defineProperty(target, memberName, {
      writable: !writable,
    })
  }
}

function Controller(path: string) {
  return function (target: Function) {
    target.prototype.path = path
  }
}

@Controller('/users')
class UserController {
  path: string

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
// console.log('this is the injected path', ctrl.path)
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
