package codebuddy.backend.service;

import codebuddy.backend.DTO.CFApiResponse;
import codebuddy.backend.DTO.ProblemDetailsDTO;
import codebuddy.backend.client.CodeForcesClient;
import codebuddy.backend.document.ProblemDoc;
import codebuddy.backend.repository.ProblemMongoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemService {

    private final ProblemMongoRepository problemMongoRepository;
    private final CodeForcesClient codeForcesClient;

    public ProblemService(ProblemMongoRepository problemMongoRepository, CodeForcesClient codeForcesClient) {
        this.problemMongoRepository = problemMongoRepository;
        this.codeForcesClient = codeForcesClient;
    }

    public ProblemDoc addOneProblem(ProblemDetailsDTO problem) {
        ProblemDoc problemDoc = new ProblemDoc();
        problemDoc.setName( problem.getName() );
        problemDoc.setContestId( problem.getContestId() );
        problemDoc.setIndex( problem.getIndex() );
        problemDoc.setType( problem.getType() );
        problemDoc.setPoints( problem.getPoints() );
        problemDoc.setTags( problem.getTags() );

        return this.problemMongoRepository.save( problemDoc );
    }

    public Integer getCountOfAllProblems() {
        return (int) this.problemMongoRepository.count();
    }

    public Integer deleteAllProblems() {
        this.problemMongoRepository.deleteAll();
        return (int) this.problemMongoRepository.count();
    }

    public List<ProblemDoc> getProblemByName(String name) {
        String namePattern = ".*" + name + ".*";
        return  this.problemMongoRepository.findByNameMatching(namePattern);
    }

    public Integer addAllProblemsFromCodeforces(){
        // Get all problems
        CFApiResponse cfApiResponse = this.codeForcesClient.getAllProblems();

        if( cfApiResponse.status().equalsIgnoreCase("OK") ){
            List<ProblemDoc> problemDocs = cfApiResponse.result().problems().stream().map(ProblemDoc::new).toList();
            // Insert them batch by batch -- 9:56pm -- 10:06 pm => took 10 mins to insert 10,200 problems
            for(int i = 0; i < problemDocs.size(); i += 1000){
                this.problemMongoRepository.saveAll(problemDocs.subList(i, Math.min(i + 1000, problemDocs.size())));
            }
            return (int) this.problemMongoRepository.count();
        }
        return 0;
    }
}
