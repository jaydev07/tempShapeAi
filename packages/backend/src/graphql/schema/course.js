import gql from "graphql-tag";

export default gql`
	
	type Course {
			"""
			User friendly Id of the course
			"""
			Id: String!
			"""
			Mongo Id of the course
			"""
			_id: String!
			"""
			Name of the course
			"""
			name: String!
			"""
			Description of the course
			"""
			description: String!
			"""
      Prerequisites for the course
			"""
      prerequisites: String!
			"""
			Type of the course (Bootcamp for now)
			"""
			type: String!
			"""
			course tags
			"""
			tags: [String]
			"""
			Course category (domain level)
			"""
			category: String!
			"""
			Image for the course
			"""
			image: Image
			"""
			Modules of the course
			"""
			modules: [ModuleRaw]
			"""
			Course Views - number of times the course been previewed
			"""
			views: Int
			"""
			Skills covered in the course
			"""
			skills: [String]
			"""
			Course Archive status
			"""
      isArchived: Boolean
      updatedAt: DateTime
      createdAt: DateTime
      publishedAt: DateTime
      
	}
	
		input  CourseInput {
      """
      User friendly Id of the course
      """
      Id: String!
      """
      Name of the course
      """
      name: String!
      """
      Description of the course
      """
      description: String!
      """
      Prerequisites for the course
      """
      prerequisites: String!
      """
      Type of the course (Bootcamp for now)
      """
      type: String!
      """
      course tags
      """
      tags: [String]
      """
      ObjectId of the course category (domain level)
      """
      category: String!
      """
      Image for the course
      """
      image: ImageInput
      """
      Skills covered in the course
      """
      skills: [String]
  }

  input CourseInput {
    """
    User friendly Id of the course
    """
    Id: String!
    """
    Name of the course
    """
    name: String!
    """
    Description of the course
    """
    description: String!
    """
    Prerequisites for the course
    """
    prerequisites: String!
    """
    Type of the course (Bootcamp for now)
    """
    type: String!
    """
    course tags
    """
    tags: [String]
    """
    ObjectId of the course category (domain level)
    """
    category: String!
    """
    Image for the course
    """
    image: ImageInput
    """
    Skills covered in the course
    """
    skills: [String]
  }

  input CourseQuery {
    name: String
    category: String
		  isDraft: Boolean
  }

  type Category {
    _id: String
    name: String
  }
  interface IModule {
    _id: String!
    isSub: Boolean
    name: String!
    description: String
    course: String!
    isProjectModule: Boolean
    isOptionModule: Boolean
      resources: [File]
      isCertificateAvailable: Boolean
      certificateTemplate: String
		  isPublished: String
		  parentModule: String
		  
  }
  type UnitTop {
    type: String
    unit: Unit
  }

  type Unit {
    _id: String
    name: String!
    description: String
    course: String!
    units: [UnitTop]
    module: String
    type: String
    details: String
    points: Int
  }
  type ModuleUnitsPopulated implements IModule {
    _id: String!
    name: String!
    description: String
    course: String!
    units: [UnitTop]
    isSub: Boolean
    parentModule: String
    isProjectModule: Boolean
    isOptionModule: Boolean
      resources: [File]
      isCertificateAvailable: Boolean
      certificateTemplate: String
      isPublished: String
  }

  type ModuleRaw implements IModule {
    _id: String!
    name: String!
    description: String
    course: String!
    units: [Unit]
    isSub: Boolean
    parentModule: String
    isProjectModule: Boolean
    isOptionModule: Boolean
      resources: [File]
      isCertificateAvailable: Boolean
      certificateTemplate: String
      isPublished: String
  }

  union Module = ModuleUnitsPopulated | Str

  input ModuleInput {
    name: String!
    description: String
    course: String
    isSub: Boolean
    parentModule: String
    isProjectModule: Boolean
    isOptionModule: Boolean
    isCertificateAvailable: Boolean
    certificateTemplate: String
  }

  type Answer {
    optionNumber: Int!
    answerBody: String!
  }

  input AnswerInput {
    optionNumber: Int!
    answerBody: String!
  }
	
	input AnswerInput {
			optionNumber: Int!
			answerBody: String!
	}
	
	input QuestionInput {
			question: String!
			answers: [AnswerInput]!
			correctAnswers: [Int]!
	}
	
	type Question {
			_id: String
      question: String!
      answers: [Answer]
      correctAnswers: [Int]
	}
	
	input taskDetailsInput {
			"""
			markdown content for document/blog
			"""
			content: String
			"""
			Array of questions if it it's a quiz task
			"""
			questions: [QuestionInput]
	}
	enum TaskType {
      DocumentTask
      ProjectTask
      Quiz
	}
	
	input TaskInput {
			name: String!
			description: String
			details: taskDetailsInput
			course: String
			"""
			Make sure the module is here a sub-module(isSub is true), else the backend will throw an error
			"""
			module: String
			type: TaskType
			points: Int
	}
	
  type CoursesPaginated {
    courses: [Course]
    hasNextPage: Boolean
    hasPrevPage: Boolean
    page: Int
    totalPages: Boolean
    nextPage: Int
    prevPage: Int
  }
  type CourseTask {
    _id: String
    name: String
    description: String
    course: String
    module: String
    type: String
    points: Int
    details: CourseTaskDetails
  }
	type CourseTask {
			_id: String
			name: String
			description: String
			course: String
			module: String
			type: String
			points: Int
			details: CourseTaskDetails
	}
	
	type CourseTaskDetails {
      parent: String!
      content: String
      type: String
			questions: [Question]
	}
	
	enum moduleType {
			Main
			Sub
	}
	extend type Mutation {
			"""
			Create Course
			"""
			createCourse(course: CourseInput): Course
			"""
			Create Category
			"""
			createCategory(name: String): Category
			"""
			Create and add a module to a course or another module
			\n To create a module at the top level, set isSub to false and leave parentModule.
			\n To create submodule, isSub = true and the parentModule (ObjectId) should be given under which it is going to be embedded
			"""
			createModule(module: ModuleInput): ModuleUnitsPopulated
      """
      Add a task to a module/sub-module
      """
      createTask(task: TaskInput): CourseTask
			"""
			Update the content of a document task
			id -> ObjectId of the DocumentTask (not parent - CourseTask)
			content -> New/updated markdown content
			"""
			updateDocumentContent(id: String! content: String!): Boolean
			"""
			Add questions to a quiz with quizId
			"""
			addQuestions(questions: [QuestionInput] quizId: String): [Question]
			"""
			Update course details with it's id
			"""
			updateCourseDetails(id: String! name: String prerequisites: String tags: [String] category: String image: ImageInput skills: [String]): Course
      """
      Update module details with it's id
      """
      updateModuleDetails(id: String! name: String description: String isCertificateAvailable: Boolean certificateTemplate: String): ModuleRaw
			"""
			Delete a module with it's id if it's empty
			"""
			deleteModule(id: String): Boolean
			"""
			Update a question with it's id and content
			"""
			updateQuestion(id: String question: QuestionInput): Question
			"""
			Delete a question with it's id
			"""
			deleteQuestion(id: String): Boolean
			"""
			Publish a course with it's ObjectId
			"""
			publishCourse(id: String): Course
			"""
			Change Archive status of a course with it's custom provided Id
			"""
			changeCourseArchiveStatus(Id: String archive:Boolean): Boolean
			"""
			Delete a Course Task (Doc or Quiz) with it's CourseTask Id
			"""
			deleteTask(id: String): Boolean
			"""
			Add, edit name or remove resources from a Module
			The id and actions are self-explainatory and are required
			For Adding: resources array is needed
			For removing: resourcesIds is needed
			For editing name of resource: the newName string is needed and only the first element of resourceIds is updated
			"""
      updateModuleResources(id: String! action: resAction! resources:[ImageInput] resourceIds: [String] newName: String): ModuleRaw
			"""
			Get module tracker by it's id for the logged in user
			"""
			getModuleTracker(id: String): ModuleTracker
	}
	enum resAction {
			add
			remove
			editName
	}

  type CourseTaskDetails {
    _id: String
    parent: String!
    content: String
    type: String
    questions: [Question]
  }

  enum moduleType {
    Main
    Sub
  }
	
	type ModuleTracker {
			_id: String
      module: String
			user: String
			courseTracker: String
			unitsCompleted: [String]
			percentageCompleted: String
      certificateGenerated: Boolean
      certificate: String
  }

	type CourseTracker {
			course: String
			courseId: String
			rootCourse: String
			courseVersion: Int
			user: String
			currentModule: String
			currentTask: String
			isCompleted: Boolean
			completionDate: DateTime
			moduleTrackers: [ModuleTracker]
			createdAt: DateTime
	}
	input  AnswerSubmitInput {
			"""
			Question Id
			"""
			question: String
			
			answers: [Int]
	}
	type CommitData {
			date: String
			count: Int
	}
	
	type Dimensions {
			height: Int!
			width: Int!
	}

  input DimensionsInput {
      height: Int!
      width: Int!
  }
	
	type CertificateTags {
			key: String
			value: String
	}

  input CertificateTagsInput {
      key: String
      value: String
  }
	type CertificateTemplate {
			_id: String
			name: String
			dimensions: Dimensions
      imageUrl: String
			type: String
			tags: [CertificateTags]
      html: String
  }
  input CertificateTemplateInput {
      name: String
      dimensions: DimensionsInput
      imageUrl: String
      type: String
		  tags: [CertificateTagsInput]
		  html: String
  }
	
	type UserCertificate {
			_id: String
			user: String
			credentialId: String
			template: String
			course: String
      purposeName: String
      userFullName: String
			module: String
			accomplishmentType: String
			status: String
			pdfUrl: String
			imgUrl: String
			createdAt: String
	}
	
  extend type Mutation {
    """
    Create Course
    """
    createCourse(course: CourseInput): Course
    """
    Create Category
    """
    createCategory(name: String): Category
    """
    		Create and add a module to a course or another module

    To create a module at the top level, set isSub to false and leave parentModule.

    To create submodule, isSub = true and the parentModule (ObjectId) should be given under which it is going to be embedded
    """
    createModule(module: ModuleInput): ModuleUnitsPopulated
    """
    Add a task to a module/sub-module
    """
    createTask(task: TaskInput): CourseTask
    """
    Update the content of a document task
    id -> ObjectId of the DocumentTask (not parent - CourseTask)
    content -> New/updated markdown content
    """
    updateDocumentContent(id: String!, content: String!): Boolean
    """
    
    Update course details with it's id
    """
    updateCourseDetails(
      id: String!
      name: String
      prerequisites: String
      tags: [String]
      category: String
      image: ImageInput
      skills: [String]
    ): Course
    """
    Update module details with it's id
    """
    updateModuleDetails(
      id: String!
      name: String
      description: String
    ): ModuleRaw
    """
    Delete a module with it's id if it's empty
    """
    deleteModule(id: String): Boolean
    """
    Update a question with it's id and content
    """
    updateQuestion(id: String, question: QuestionInput): Question
    """
    Delete a question with it's id
    """
    deleteQuestion(id: String): Boolean
		  """
		  Commit a task with it's id
		  """
		  commitTask(id: String): CourseTracker
      """
      Enroll in a course
      """
      enrollCourse(id: String): String
		  """
		  Submit Quiz with it's taskId
		  """
		  submitQuiz(id: String answers: [AnswerSubmitInput]): Boolean
  }

  extend type Query {
    """
    Get course by id, or Id
    _id -> Mongo ObjectId
    Id -> Id given while creating the course
    """
    getCourse(_id: String, Id: String isDraft: Boolean): Course
    """
    Get courses paginated
    """
    getCourses(page: Int, query: CourseQuery): CoursesPaginated
    """
    Get all categories
    """
    getCategories: [Category]
    """
    Get modules with their ids or courseId
    """
    getModules(ids: [String], courseId: String): [ModuleUnitsPopulated]
    """
    Get a course task with it details populated
    """
    getTask(id: String): CourseTask
		  """
		  Get course tracker by course ObjectId
		  """
		  getCourseTracker(course: String): CourseTracker
		  """
		  get heatmap data for a user by user id
		  """
		  getHeatmapData(userId: String): [CommitData]
      """
      getCurrentTracker of currently enrolled course of the user
      """
      getCurrentTracker: CourseTracker
		  """
		  get course's total points
		  """
      getCourseTotalPoints(courseId: String!): Int
  }
`;
