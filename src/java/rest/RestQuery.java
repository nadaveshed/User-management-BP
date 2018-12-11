package rest;

import com.google.gson.Gson;

import java.sql.SQLException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import sql.SQLInstance;

/**
 * REST Web Service
 *
 * @author nadav
 */
@Path("query")
public class RestQuery {

    @Context
    private UriInfo context;
    
   
    /**
     * Creates a new instance of RestQuery
     */
    public RestQuery() {
    }

    /**
     * Retrieves representation of an instance of rest.RestQuery
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson() {
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

    /**
     * PUT method for updating or creating an instance of RestQuery
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void putJson(String content) {
    }
    
    @GET
    @Path("getUsers")
    public String getUsers() throws SQLException {
        return new Gson().toJson(SQLInstance.getInstance().getUsers());
    }
    
    @POST
    @Path("addUser")
    public String addUser(@QueryParam("firstName") String firstName, @QueryParam("lastName") String lastName, @QueryParam("email") String email) throws SQLException {
        SQLInstance.getInstance().addUser(firstName, lastName, email);
        return "DONE";
    }   
}
