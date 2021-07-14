# Monorepo for Frontend

- yarn의 Workspace는 monorepo, 즉 여러개의 패키지를 관리해줍니다.
- 이 예시에선 create-react-app과 Next.js를 패키지로 구분하고 팀 내에서 공통으로 만들어 사용하는 지역 패키지(local package) `utils`가 있다고 가정합니다.
- 먼저 환경을 설정하기 위해선 `lerna`와 `yarn workspaces` 설정을 같이 해줍니다.
  - 이렇게 해줌으로써 버전 관리 및 배포는 `lerna`에게 그리고 의존성 관리는 `yarn`에게 위임합니다.
  - root에서 `yarn install`을 하면 root의 `node_modules`에 `packages`의 의존성 패키지들이 설치되어 모여있는 것을 알 수 있습니다.
    - `yarn add`를 실행하면 다음과 같은 에러가 발생합니다.
    - `error Missing list of packages to add to your project`
  - 이 명령어는 `lerna bootstrap --hoist`와 같은 역할을 하는데 `lerna`보단 `yarn`이 더 잘 수행합니다.
  - 따라서 패키지를 배포하지 않고 패키지 의존성을 관리하거나 지역 패키지를 사용하는데 유용한 환경으로 monorepo를 사용한다면 `lerna`를 굳이 환경으로 설정하지 않아도 됩니다.
- 만약 `packages/utils` 처럼 배포가 아닌 지역 패키지로 사용하고 싶은 경우 두 가지 방법이 있습니다. (`packages/client/pages/_app.tsx`에서 `@service/utils`를 사용)
  1. `root/tsconfig.json`에 주석처리한 것 처럼 `baseUrl` 옵션과 `paths` 옵션을 사용하여 다른 `packages`에서 `import`하여 사용하는 방법
  2. 이렇게 하지 않고 `packages`의 패키지가 해당 지역 패키지를 사용한다면 `package.json`에 지역 패키지의 이름과 버전을 명시하고 `yarn install`을 실행해 지역 패키지를 `root/node_modules`에 설치하는 방법
- 두 방법 모두 가능하지만 두 번째 방법을 사용하는 것이 더 좋을 것 같습니다. 왜냐하면 기본적으로 workspaces를 사용한다는게 그런 의미이기 때문이지 typescript의 기능을 사용하는게 목표는 아니기 때문입니다. 다만 utils가 수정된다면 utils의 `package.json`의 버전을 수정하고 사용하는 쪽의 버전도 수정해야 합니다. 또한 `yarn install`을 통해 패키지를 관리해줘야 하는 번거로움도 있습니다.
- 위에서 살펴봤다시피 workspaces에서 workspace를 구분하는 기준은 디렉터리 이름이 아닌 `package.json`의 `name` 필드 입니다.
- 다음은 유용한 몇몇 명령어 입니다.
  - `yarn workspace <package-name> <command>` : `package-name`을 `package.json`의 `name` 필드로 갖는 패키지에 `command` 명령어를 실행합니다.
    - 따라서 만약 단독 패키지에 특정 의존성(react)을 추가하고 싶다면 다음 명령어를 실행합니다.
    - `yarn workspace <package-name> add react`
  - `yarn add <package-name> --ignore-workspace-root-check` : 만약 각 패키지가 아니라 모든 패키지의 공통 의존성을 추가하고 싶다면 root의 `package.json`에 의존성을 설정해야 합니다. 그럴 땐 `--ignore-workspace-root-check` 옵션으로 의존성을 설치합니다. 예를 들어 다음과 같이 사용합니다. (단축 옵션은 `-W`입니다.)
    - `yarn add typescript -D -W`
    - 공통적으로 사용하는 typescript, jest 등의 환경 설정은 이런 방법으로 설치 및 관리하면 좋습니다.
  - 지역 패키지를 사용하고 싶다면 사용하고자하는 패키지의 `package.json`에 직접 지역 패키지를 작성합니다. 그 이후에 `yarn install`을 통해 설치합니다. 예를 들면 다음과 같이 작성합니다.
    - `"@service/utils": "1.0.0"`
    - `yarn workspace client add @service/utils`를 사용해 설치하게 되면 다음과 같은 에러가 발생합니다.
      - `error An unexpected error occurred: "https://registry.yarnpkg.com/@service%2futils: Not found".`
  - `lerna add <package-name>` : `packages`의 모든 패키지에 `package-name`을 설치합니다.
  - `lerna add <package-name> --scope=<local-package-name>` : `packages` 하위의 `local-package-name` 패키지에 `package-name`을 설치합니다.
  - `lerna publish` : 마지막 변경점에서 변경된 사항이 있는 모든 지역 패키지를 배포합니다.

## [참고]
- [Lerna와 Yarn workspaces를 활용한 패키지 관리](https://medium.com/wantedjobs/lerna%EC%99%80-yarn-workspaces%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%ED%8C%A8%ED%82%A4%EC%A7%80-%EA%B4%80%EB%A6%AC-429d2a685486)
- [Lerna와 yarn-workspace를 활용한 Mono Repo (Typescript & Jest) 환경 구성하기](https://jojoldu.tistory.com/585)
- [[MonoRepo] lerna? yarn workspace? 크게 개념만 잡아보기](https://simsimjae.medium.com/monorepo-lerna-yarn-workspace-%ED%81%AC%EA%B2%8C-%EA%B0%9C%EB%85%90%EB%A7%8C-%EC%9E%A1%EC%95%84%EB%B3%B4%EA%B8%B0-c58bc4ba31fe)
- [Why Lerna and Yarn Workspaces is a Perfect Match for Building Mono-Repos – A Close Look at Features and Performance](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/)
- [lerna](https://github.com/lerna/lerna)
- [yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces)